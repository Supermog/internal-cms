import { Request } from 'express';
import { RequestUser } from '../modules/auth/jwt.strategy';

export interface AuthenticatedRequest extends Request {
  user: RequestUser;
}
