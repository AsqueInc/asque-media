import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { PaymentService } from './payment.service';
import { ProcessPaymentDto, SubscribeDto } from './dto/process-payment.dto';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

@ApiTags('payment-endpoints')
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @UseGuards(JwtGuard)
  @ApiSecurity('JWT-auth')
  @Post('')
  @ApiOperation({ summary: 'Process payment for an order' })
  processPayment(@Body() dto: ProcessPaymentDto, @Req() req) {
    return this.paymentService.processPayment(dto, req.user.profileId);
  }

  @UseGuards(JwtGuard)
  @ApiSecurity('JWT-auth')
  @Post('/subscribe')
  @ApiOperation({ summary: 'Subscribe to asque' })
  subscribe(@Body() dto: SubscribeDto, @Req() req) {
    return this.paymentService.subscribe(req.user.email, dto);
  }

  @UseGuards(JwtGuard)
  @ApiSecurity('JWT-auth')
  @Post('verify/:reference')
  @ApiOperation({
    summary: 'Manually verify the status of a payment via paystack',
  })
  registerUser(@Param('reference') reference: string) {
    return this.paymentService.verifyPaymentViaPaystack(reference);
  }

  @Get('banks')
  @ApiOperation({ summary: 'Get bank details' })
  getBanks() {
    return this.paymentService.getBanks();
  }

  @Post('webhook')
  @ApiOperation({ summary: 'Verify payment status webhook endpoint' })
  verifyPaymentViaWebhook(@Req() req) {
    return this.paymentService.verifyPaymentViaWebhook(req);
  }
}
