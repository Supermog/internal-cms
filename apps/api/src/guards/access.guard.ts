import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '@internal-cms/shared';
import { REQUIRE_ACCESS_KEY } from '../decorators/require-access.decorator';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { AuthenticatedRequest } from '../types/authenticated-request.types';

@Injectable()
export class AccessGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const requiredAccess = this.reflector.getAllAndOverride<UserRole>(
      REQUIRE_ACCESS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (requiredAccess == null) {
      return true;
    }

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('Not authenticated');
    }

    const role = user.role;

    switch (requiredAccess) {
      case UserRole.ADMIN:
        if (role !== UserRole.ADMIN) {
          throw new ForbiddenException('Admin access required');
        }
        return true;
      case UserRole.CLIENT:
        if (role !== UserRole.CLIENT) {
          throw new ForbiddenException('Client access required');
        }
        return true;
      default:
        return true;
    }
  }
}
