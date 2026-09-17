import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly resend: Resend;
  private readonly from: string;

  constructor(private readonly config: ConfigService) {
    const key = this.config.get<string>('RESEND_API_KEY') ?? 're_test_key';
    this.resend = new Resend(key);
    this.from = this.config.get<string>('MAIL_FROM') ?? 'Qadem <noreply@qadem.site>';
  }

  async send(to: string, subject: string, html: string): Promise<boolean> {
    try {
      const { error } = await this.resend.emails.send({
        from: this.from,
        to,
        subject,
        html,
      });

      if (error) {
        this.logger.error(`Failed to send to ${to}: ${error.message}`);
        return false;
      }

      return true;
    } catch (err) {
      this.logger.error(`Mail error for ${to}`, err as Error);
      return false;
    }
  }
}