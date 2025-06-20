import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { MAIL_CONFIG } from 'src/constants';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    if (
      !MAIL_CONFIG.HOST ||
      !MAIL_CONFIG.PORT ||
      !MAIL_CONFIG.USER ||
      !MAIL_CONFIG.KEY
    ) {
      console.warn(
        '[MailService] Missing mail configuration. Check your .env file.',
      );
    }
    this.transporter = nodemailer.createTransport({
      host: MAIL_CONFIG.HOST,
      port: MAIL_CONFIG.PORT,
      secure: MAIL_CONFIG.PORT === 465, // true for 465 (SSL), false for 587 (TLS/STARTTLS)
      auth: {
        user: MAIL_CONFIG.USER,
        pass: MAIL_CONFIG.KEY,
      },
    });
  }

  async sendMail(
    to: string,
    subject: string,
    text: string,
    html?: string,
  ): Promise<void> {
    try {
      console.log(MAIL_CONFIG);
      await this.transporter.sendMail({
        from: `"${MAIL_CONFIG.FROM}" <${MAIL_CONFIG.FROM}>`,
        to,
        subject,
        text,
        html,
      });
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Failed to send email');
    }
  }
}
