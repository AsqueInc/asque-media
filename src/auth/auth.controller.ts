import {
  Body,
  Controller,
  Param,
  Post,
  Patch,
  UseGuards,
  Get,
  Req,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { VerifyEmailDto } from './dto/verify-email.otp';
import { SendResetPasswordEmailDto } from './dto/send-reset-email.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { JwtGuard } from './guards/jwt.guard';
import { GoogleAuthGuard } from './guards/google.guard';
import { AddAdminDto } from './dto/add-admin.dto';

@ApiTags('auth-endpoints')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  registerUser(@Body() dto: RegisterUserDto) {
    return this.authService.registerUser(dto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Log a user in' })
  loginUser(@Body() dto: LoginDto) {
    return this.authService.loginUser(dto);
  }

  @UseGuards(JwtGuard)
  @ApiSecurity('JWT-auth')
  @Patch('change-password')
  @ApiOperation({ summary: 'Change a user password' })
  changePassword(
    @Body() dto: ChangePasswordDto,
    @Req() req,
    // @Param('userId') userId: string,
  ) {
    return this.authService.changePassword(dto, req.user.userId);
  }

  @UseGuards(JwtGuard)
  @ApiSecurity('JWT-auth')
  @ApiOperation({ summary: 'Request email verification otp' })
  @Post('request-email-verification')
  requestEmailVerification(
    @Req() req,
    // @Param('userId') userId: string
  ) {
    return this.authService.requestEmailVerification(req.user.userId);
  }

  @UseGuards(JwtGuard)
  @ApiSecurity('JWT-auth')
  @Patch('verify-email')
  @ApiOperation({ summary: 'Verify email' })
  verifyEmail(
    @Body() dto: VerifyEmailDto,
    // @Param('userId') userId: string,
    @Req() req,
  ) {
    return this.authService.verifyEmail(req.user.userId, dto);
  }

  @Post('request-password-reset')
  @ApiOperation({ summary: 'Send reset password otp' })
  requestForgotPasswordEmail(@Body() dto: SendResetPasswordEmailDto) {
    return this.authService.requestForgotPasswordEmail(dto);
  }

  @Patch('reset-password')
  @ApiOperation({ summary: 'Reset password' })
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }

  @UseGuards(JwtGuard)
  @ApiSecurity('JWT-auth')
  @Get('')
  @ApiOperation({ summary: 'Get user details by Id' })
  getUserDetailsById(
    @Req() req,
    // @Param('userId') userId: string
  ) {
    return this.authService.getUserDetailsById(req.user.userId);
  }

  // @UseGuards(JwtGuard)
  // @ApiSecurity('JWT-auth')
  @Post('refresh-access-token/:userId')
  @ApiOperation({ summary: 'Refresh access token' })
  refreshAccessToken(
    // @Req() req,
    @Param('userId') userId: string,
  ) {
    return this.authService.refreshAccessToken(userId);
  }

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async googleLogin() {}

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleLoginCallback(@Req() req, @Res() res) {
    const { accessToken, userId, email, profileId, role } = req.user;
    return res.send({ accessToken, userId, email, profileId, role });
  }

  @Patch('add-admin/:userId')
  @UseGuards(JwtGuard)
  @ApiSecurity('JWT-auth')
  @ApiOperation({ summary: 'Add admin user' })
  addAdmin(@Req() req, @Body() dto: AddAdminDto) {
    return this.authService.addAdmin(req.user.userId, dto);
  }
}
