import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport } from 'nodemailer';
import * as Mail from 'nodemailer/lib/mailer';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class EmailNotificationService {
  private nodeMailerTransport: Mail;
  constructor(
    private readonly configService: ConfigService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private config: ConfigService,
  ) {
    //setup mail service provider
    this.nodeMailerTransport = createTransport({
      service: configService.get('EMAIL_SERVICE'),
      auth: {
        type: 'OAuth2',
        user: configService.get('USER_EMAIL'),
        clientId: configService.get('AUTH_CLIENT_ID'),
        clientSecret: configService.get('AUTH_CLIENT_SECRET'),
        refreshToken: configService.get('AUTH_REFRESH_TOKEN'),
      },
    });
  }

  /**
   * function to send otp email
   * @param to : email address of reciepient
   * @param otp : generated otp
   */
  async sendOtpEmail(to: string, otp: string) {
    const mailOptions = {
      from: this.config.get('USER_EMAIL'),
      to: to,
      subject: 'Verification Otp',
      text: `Hi there, Here is your verification otp ${otp}`,
    };

    await this.nodeMailerTransport.sendMail(mailOptions).catch((error) => {
      this.logger.error(error);
      throw new HttpException(
        'Email not sent',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    });
  }

  /**
   * function to notify a customer that order item has been shipped
   * @param to : email address of reciepient
   * @param orderItemId : id of order item
   */
  async sendOrderShippedEmail(to: string, orderItemId: string) {
    const mailOptions = {
      from: this.config.get('USER_EMAIL'),
      to: to,
      subject: 'Order Shipment',
      text: `Your order with id: ${orderItemId} has been shipped.`,
    };

    await this.nodeMailerTransport.sendMail(mailOptions).catch((error) => {
      this.logger.error(error);
      throw new HttpException(
        'Email not sent',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    });
  }
}
