import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { User } from '@supabase/supabase-js';
import { Observable } from 'rxjs';

@Injectable()
export class AuthenticatedUserInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const user = request.user as User;

    if (user && user.id) {
      request['user'] = user;
    }

    return next.handle();
  }
}
