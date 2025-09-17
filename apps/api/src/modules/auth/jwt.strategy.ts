import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { supabaseClient } from '../../config/supabase.config';
import { UserRole } from '@internal-cms/shared';
import * as jwksClient from 'jwks-rsa';

// Define the user type that will be attached to the request
export interface RequestUser {
  id: string;
  email: string;
  name?: string;
  role?: UserRole;
  client_uid?: string | null;
  created_at?: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly configService: ConfigService) {
    const supabaseUrl = configService.get('SUPABASE_PROJECT_URL');

    if (!supabaseUrl) {
      throw new Error('SUPABASE_PROJECT_URL is not defined');
    }

    // Create JWKS client for Supabase
    const client = jwksClient({
      jwksUri: `${supabaseUrl}/auth/v1/.well-known/jwks.json`,
      cache: true,
      cacheMaxAge: 600000, // 10 minutes
      rateLimit: true,
      jwksRequestsPerMinute: 5,
    });

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKeyProvider: (request, rawJwtToken, done) => {
        const decoded = this.decodeJwt(rawJwtToken);
        if (!decoded || !decoded.header.kid) {
          return done(new Error('Unable to decode JWT or missing kid'));
        }

        client.getSigningKey(decoded.header.kid, (err, key) => {
          if (err) {
            return done(err);
          }
          const signingKey = key?.getPublicKey();
          done(null, signingKey);
        });
      },
      algorithms: ['ES256'],
      audience: 'authenticated',
      passReqToCallback: false,
    });
  }

  private decodeJwt(token: string) {
    try {
      const [header, payload] = token.split('.');
      return {
        header: JSON.parse(Buffer.from(header, 'base64').toString()),
        payload: JSON.parse(Buffer.from(payload, 'base64').toString()),
      };
    } catch (error) {
      console.log('=== JwtStrategy.decodeJwt() error ===', error);
      return null;
    }
  }

  public async validate(payload: any): Promise<RequestUser> {
    try {
      // Extract user ID from JWT payload
      const userId = payload.sub;

      if (!userId) {
        throw new UnauthorizedException('Invalid token payload');
      }

      // Get the user from our database
      const { data: dbUser, error: dbError } = await supabaseClient
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (dbError || !dbUser) {
        throw new UnauthorizedException({
          statusCode: 401,
          error: 'Unauthorized',
          message: 'User not found in database',
        });
      }

      // Return the user data that will be attached to the request
      return {
        id: dbUser.id,
        email: dbUser.email,
        name: dbUser.name,
        role: (dbUser.role as UserRole) || undefined,
        client_uid: dbUser.client_uid || undefined,
        created_at: dbUser.created_at,
      };
    } catch (error) {
      console.log('=== JwtStrategy.validate() error ===', error);
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      throw new UnauthorizedException({
        statusCode: 401,
        error: 'Unauthorized',
        message: 'Authentication failed',
      });
    }
  }
}
