import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@supabase/supabase-js';
import { jwtDecode } from 'jwt-decode';
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>('public', [
      context.getHandler(),
      context.getClass(),
    ]);

    const isApiKey = this.reflector.getAllAndOverride<boolean>('apikey', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    if (isApiKey) {
      return true;
    }

    return super.canActivate(context);
  }
}
@Injectable()
export class JwtAuthGuardMock extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const accessToken = context
      .switchToHttp()
      .getRequest()
      .headers?.authorization?.replace('Bearer ', '');

    if (!accessToken) {
      //TODO: it needs to be false, when tests are fixed to use AdmitServiceModule only
      return true;
    }

    // Decode the token
    const payload: User = jwtDecode(accessToken);

    const requestUser: User = { ...payload };

    // Add populated user to request
    context.switchToHttp().getRequest().user = requestUser;
    return true;
  }
}
