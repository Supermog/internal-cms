import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { supabaseClient } from '../../config/supabase.config';

// Define the user type that will be attached to the request
export interface RequestUser {
  id: string;
  email: string;
  name?: string;
  role?: string;
  client_uid?: string | null;
  created_at?: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    const secret = configService.get('SUPABASE_JWT_SECRET');

    if (!secret) {
      throw new Error('SUPABASE_JWT_SECRET is not defined');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: secret,
      issuer: configService.get('SUPABASE_PROJECT_URL'),
      audience: 'authenticated',
      algorithms: ['HS256'],
      passReqToCallback: false,
    });
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
        role: dbUser.role || undefined,
        client_uid: dbUser.client_uid || undefined,
        created_at: dbUser.created_at,
      };
    } catch (error) {
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
