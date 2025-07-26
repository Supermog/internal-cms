import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { AcceptInviteDto } from '../dto/invite.dto';

export class SignInDto {
  email!: string;
  password!: string;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signUpWithInvite(
    @Body(new ValidationPipe()) acceptInviteDto: AcceptInviteDto,
  ) {
    return this.authService.signUpWithInvite(acceptInviteDto);
  }

  @Post('signin')
  async signIn(@Body(new ValidationPipe()) signInDto: SignInDto) {
    const { email, password } = signInDto;
    return this.authService.signIn(email, password);
  }

  @Get('user/:id')
  async getUser(@Param('id') userId: string) {
    return this.authService.getUser(userId);
  }

  @Delete('user/:id')
  async deleteUser(@Param('id') userId: string) {
    return this.authService.deleteUser(userId);
  }
}
