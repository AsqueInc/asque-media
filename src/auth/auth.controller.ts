import {
  Body,
  Controller,
  Param,
  Post,
  Patch,
  UseGuards,
  Get,
  // Req,
  // Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { VerifyEmailDto } from './dto/verify-email.otp';
import { SendResetPasswordEmailDto } from './dto/send-reset-email.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { JwtGuard } from './guards/jwt.guard';
import { GoogleAuthGuard } from './guards/google.guard';

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

  @UseGuards(JwtGuard)
  @ApiSecurity('JWT-auth')
  @Patch('change-password/:userId')
  changePassword(
    @Body() dto: ChangePasswordDto,
    @Param('userId') userId: string,
  ) {
    return this.authService.changePassword(dto, userId);
  }

  @UseGuards(JwtGuard)
  @ApiSecurity('JWT-auth')
  @Post('request-email-verification/:userId')
  requestEmailVerification(@Param('userId') userId: string) {
    return this.authService.requestEmailVerification(userId);
  }

  @UseGuards(JwtGuard)
  @ApiSecurity('JWT-auth')
  @Patch('verify-email/:userId')
  verifyEmail(@Body() dto: VerifyEmailDto, @Param('userId') userId: string) {
    return this.authService.verifyEmail(userId, dto);
  }

  @Post('send-reset-password-email')
  requestForgotPasswordEmail(@Body() dto: SendResetPasswordEmailDto) {
    return this.authService.requestForgotPasswordEmail(dto);
  }

  @Patch('reset-password')
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }

  @UseGuards(JwtGuard)
  @ApiSecurity('JWT-auth')
  @Get('user')
  getUser(@Param('userId') userId: string) {
    return this.authService.getUserDetails(userId);
  }

  @UseGuards(JwtGuard)
  @ApiSecurity('JWT-auth')
  @Post('refresh-access-token/:userId')
  refreshAccessToken(@Param('userId') userId: string) {
    return this.authService.refreshAccessToken(userId);
  }

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async googleLogin() {}

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleLoginCallback() {}
}
