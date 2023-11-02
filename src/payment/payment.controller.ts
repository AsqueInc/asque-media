import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { PaymentService } from './payment.service';
import { ProcessPaymentDto } from './dto/process-payment.dto';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

@UseGuards(JwtGuard)
@ApiSecurity('JWT-auth')
@ApiTags('payment-endpoints')
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('')
  @ApiOperation({ summary: 'Process payment for an order' })
  processPayment(@Body() dto: ProcessPaymentDto) {
    return this.paymentService.processPayment(dto);
  }

  @Post('verify/:reference/:orderId')
  @ApiOperation({ summary: 'Verify the status of a payment' })
  registerUser(
    @Param('reference') reference: string,
    @Param('orderId') orderId: string,
  ) {
    return this.paymentService.verifyPayment(reference, orderId);
  }
}
