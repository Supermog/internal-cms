import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

export interface User {
  id: string;
  email: string;
  role?: string | null;
  client_uid?: string | null;
}

export const User = createParamDecorator(
  (ctx: ExecutionContext): User | null => {
    const request = ctx.switchToHttp().getRequest<AuthenticatedRequest>();
    const user = request.user;

    if (!user) {
      return null;
    }

    return user;
  },
);

export const CurrentUser = User; // Alias for convenience
