// Example usage of Auth Middleware

/*
USAGE EXAMPLES:

1. Protecting entire controller:
```typescript
@Controller('protected')
@UseGuards(AuthGuard)
export class ProtectedController {
  @Get()
  async getProtectedData(@CurrentUser() user: any) {
    return { message: `Hello ${user.email}!` };
  }
}
```

2. Protecting specific routes:
```typescript
@Controller('mixed')
export class MixedController {
  @Get('public')
  async getPublicData() {
    return { message: 'This is public' };
  }

  @Get('private')
  @UseGuards(AuthGuard)
  async getPrivateData(@CurrentUser() user: any) {
    return { message: `Hello ${user.email}!` };
  }
}
```

3. Optional authentication (user available if authenticated):
```typescript
@Controller('optional')
@UseGuards(OptionalAuthGuard)
export class OptionalController {
  @Get()
  async getData(@CurrentUser() user: any) {
    if (user) {
      return { message: `Welcome back, ${user.email}!` };
    }
    return { message: 'Welcome, guest!' };
  }
}
```

4. Extracting specific user properties:
```typescript
@Controller('user-data')
@UseGuards(AuthGuard)
export class UserDataController {
  @Get()
  async getUserInfo(
    @CurrentUser('id') userId: string,
    @CurrentUser('email') email: string,
    @CurrentUser('role') role: string,
  ) {
    return { userId, email, role };
  }
}
```

AUTHENTICATION FLOW:

1. Client sends request with Authorization header: "Bearer <jwt_token>"
2. AuthMiddleware intercepts and verifies the token with Supabase
3. If valid, user info is added to request object
4. AuthGuard checks if user exists on request
5. @CurrentUser decorator extracts user data for controllers

TOKEN FORMAT:
- Header: Authorization: Bearer <supabase_jwt_token>
- The JWT token should be obtained from Supabase Auth (signin/signup endpoints)

ERROR RESPONSES:
- 401 Unauthorized: Missing, invalid, or expired token
- 403 Forbidden: Token valid but insufficient permissions (if role-based auth added)
*/
