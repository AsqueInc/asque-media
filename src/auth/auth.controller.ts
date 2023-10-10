import { Body, Controller, Param, Post, Patch } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { VerifyEmailDto } from './dto/verify-email.otp';
import { SendResetPasswordEmailDto } from './dto/send-reset-email.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@ApiTags('auth-endpoints')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  registerUser(@Body() dto: RegisterUserDto) {
    return this.authService.registerUser(dto);
  }

  @Post('login')
  loginUser(@Body() dto: LoginDto) {
    return this.authService.loginUser(dto);
  }

  // @UseGuards(AuthGuard)
  // @ApiBearerAuth('token')
  @Patch('change-password/:id')
  changePassword(@Body() dto: ChangePasswordDto, @Param('id') id: string) {
    return this.authService.changePassword(dto, id);
  }

  // @UseGuards(AuthGuard)
  @ApiBearerAuth('token')
  @Post('request-email-verification/:userId')
  requestEmailVerification(@Param('userId') userId: string) {
    return this.authService.requestEmailVerification(userId);
  }

  // @UseGuards(AuthGuard)
  // @ApiBearerAuth('token')
  @Patch('verify-email/:userId')
  verifyEmail(@Body() dto: VerifyEmailDto, @Param('userId') userId: string) {
    return this.authService.verifyEmail(userId, dto);
  }

  // @UseGuards(AuthGuard)
  // @ApiBearerAuth('token')
  @Post('send-reset-password-email')
  requestForgotPasswordEmail(@Body() dto: SendResetPasswordEmailDto) {
    return this.authService.requestForgotPasswordEmail(dto);
  }

  // @UseGuards(AuthGuard)
  // @ApiBearerAuth('token')
  @Patch('reset-password')
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }
}
