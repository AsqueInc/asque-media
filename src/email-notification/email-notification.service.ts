import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport } from 'nodemailer';
import * as Mail from 'nodemailer/lib/mailer';
import { SendOtpEmailDto } from './dto/send-otp.dto';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class EmailNotificationService {
  private nodeMailerTransport: Mail;
  constructor(
    private readonly configService: ConfigService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {
    //setup mail service provider
    this.nodeMailerTransport = createTransport({
      service: configService.get('EMAIL_SERVICE'),
      auth: {
        type: 'OAuth2',
        user: configService.get('USER_EMAIL'),
        clientId: configService.get('EMAIL_CLIENT_ID'),
        clientSecret: configService.get('EMAIL_CLIENT_SECRET'),
        refreshToken: configService.get('EMAIL_REFRESH_TOKEN'),
      },
    });
  }

  /**
   * function to send otp email
   * @param dto : send email dto
   */
  async sendOtpEmail(dto: SendOtpEmailDto) {
    const mailOptions = {
      from: 'alahirajeffrey@gmail.com',
      to: dto.to,
      subject: 'Verification Otp',
      text: `Hi there, Here is your verification otp ${dto.otp}`,
    };

    await this.nodeMailerTransport
      .sendMail(mailOptions)
      .then((response) => {
        this.logger.info(`Email sent: ${response.response}`);
      })
      .catch((error) => {
        this.logger.error(error);
        throw error;
      });
  }
}
