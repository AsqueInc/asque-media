import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma.service';
import { Logger } from 'winston';
import { ProcessPaymentDto } from './dto/process-payment.dto';
import axios from 'axios';
import { ApiResponse } from 'src/types/response.type';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

@Injectable()
export class PaymentService {
  private paystackApiKey: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {
    this.paystackApiKey = this.configService.get<string>('PAYSTACK_API_KEY');
  }

  /**
   * process payment for an order
   * @param dto : process payment dto
   * @returns : status code with authorization url
   */
  async processPayment(dto: ProcessPaymentDto): Promise<ApiResponse> {
    try {
      const profile = await this.prisma.profile.findFirst({
        where: { id: dto.profileId },
      });

      // create transaction with paystack
      const response = await axios.post(
        'https://api.paystack.co/transaction/initialize',
        {
          email: profile.email,
          amount: dto.amount * 100,
          currency: 'NGN', // Nigerian Naira
        },
        {
          headers: {
            Authorization: `Bearer ${this.paystackApiKey}`,
          },
        },
      );

      // get response details
      const responseData = response.data.data;

      // save transaction details to database
      await this.prisma.payment.create({
        data: {
          transactionId: responseData.reference,
          payeeEmail: profile.email,
          amount: dto.amount,
          payeeId: profile.id,
          orderId: dto.orderId,
        },
      });

      return {
        statusCode: HttpStatus.OK,
        message: {
          redirectUrl: responseData.authorization_url,
          reference: responseData.reference,
        },
      };
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * verify the status of a payment
   * @param reference : transaction reference
   * @param orderId : id of order
   * @returns :status code and message
   */
  async verifyPayment(reference: string, orderId: string) {
    try {
      // make request to paystack
      const response = await axios.get(
        `https://api.paystack.co/transaction/verify/${reference}`,
        {
          headers: {
            Authorization: `Bearer ${this.paystackApiKey}`,
          },
        },
      );

      // get response status
      const status = response.data.data.status;

      switch (status) {
        case 'success':
          // update order status if payment status is successful
          await this.prisma.order.update({
            where: { id: orderId },
            data: { status: 'PAID' },
          });

          return {
            statusCode: HttpStatus.OK,
            message: { message: 'Payment successful' },
          };
        case 'pending':
          return {
            statusCode: HttpStatus.OK,
            message: { message: 'Payment pending' },
          };
        case 'failed':
          return {
            statusCode: HttpStatus.OK,
            message: { message: 'Payment failed' },
          };
      }
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
