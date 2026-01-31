import { SetMetadata } from '@nestjs/common';
import { UserRole } from '@internal-cms/shared';

export const REQUIRE_ACCESS_KEY = 'requireAccess';

/**
 * Who can use the endpoint:
 * - ADMIN: only users with role UserRole.ADMIN
 * - CLIENT: only users with role UserRole.CLIENT (client users)
 */

export const RequireAccess = (access: UserRole) =>
  SetMetadata(REQUIRE_ACCESS_KEY, access);
