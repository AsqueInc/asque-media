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
      text: `Hi there, Here is your email verification otp ${otp}`,
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
   * function to send password reset otp
   * @param address : email address of user
   * @param otp : generated otp
   */
  async sendForgotPasswordEmail(address: string, otp: string) {
    const mailOptions = {
      from: this.config.get('USER_EMAIL'),
      to: address,
      subject: 'Password Reset',
      text: `Hi there, Here is your password reset otp ${otp}`,
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
  async sendOrderShippedEmail(to: string, orderId: string, trackingId: string) {
    const mailOptions = {
      from: this.config.get('USER_EMAIL'),
      to: to,
      subject: 'Order Shipment',
      text: `Your order with id: ${orderId} has been shipped. Your tracking id is ${trackingId}`,
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
   * notify admin that an order has been paid for
   * @param orderId : string
   */
  async notifyAdminOfCompletePayment(orderId: string) {
    const mailOptions = {
      // from: this.config.get('USER_EMAIL'),
      to: this.config.get('USER_EMAIL'),
      subject: 'Payment Complete',
      text: `An order with id: ${orderId} has been payed for.`,
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
   * notify admin that a subscription has successful occured
   * @param orderId : string
   */
  async notifyAdminOfCompleteSubscription(transactionReference: string) {
    const mailOptions = {
      // from: this.config.get('USER_EMAIL'),
      to: this.config.get('USER_EMAIL'),
      subject: 'Subscription Complete',
      text: `A subscription with reference: ${transactionReference} has been completed for.`,
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
   * notify admin that an order has been paid for
   * @param orderId : string
   */
  async notifyAdminOfCanceledSubscription(transactionReference: string) {
    const mailOptions = {
      // from: this.config.get('USER_EMAIL'),
      to: this.config.get('USER_EMAIL'),
      subject: 'Subscription Cancelled',
      text: `A subscription with reference: ${transactionReference} has been cancelled.`,
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
