import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('payment-controller')
@Controller('payment')
export class PaymentController {}
