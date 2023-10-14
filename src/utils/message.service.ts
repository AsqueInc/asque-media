import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import * as twilio from 'twilio';

@Injectable()
export class MessageService {
  private readonly client: twilio.Twilio;
  constructor(
    private config: ConfigService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {
    this.client = twilio(
      config.get('TWILIO_ACCOUNT_SID'),
      config.get('TWILIO_AUTH_TOKEN'),
    );
  }

  /**
   * send text message via twilio api
   * @param to : reciever address
   * @param body : body of message
   */
  async sendTestMessage(to: string, body: string) {
    await this.client.messages
      .create({
        to: to,
        body: body,
        from: this.config.get('TWILIO_NUMBER'),
      })
      .catch((error) => {
        this.logger.error(error);
        throw new HttpException(
          'Message not sent',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      });
  }
}
