import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  // Query,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { PaymentService } from './payment.service';
import { ProcessPaymentDto } from './dto/process-payment.dto';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
// import { PaginationDto } from 'src/category/dto/pagination.dto';

// @UseGuards(JwtGuard)
// @ApiSecurity('JWT-auth')
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
