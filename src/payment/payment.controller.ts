import {
  Body,
  Controller,
  Get,
  Param,
  Post,
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
  processPayment(@Body() dto: ProcessPaymentDto) {
    return this.paymentService.processPayment(dto);
  }

  @UseGuards(JwtGuard)
  @ApiSecurity('JWT-auth')
  @Post('verify/:reference/:orderId')
  @ApiOperation({ summary: 'Verify the status of a payment' })
  registerUser(
    @Param('reference') reference: string,
    @Param('orderId') orderId: string,
  ) {
    return this.paymentService.verifyPayment(reference, orderId);
  }

  @Get('banks')
  @ApiOperation({ summary: 'Get bank details' })
  getBanks() {
    return this.paymentService.getBanks();
  }
}
