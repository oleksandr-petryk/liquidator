import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { convert } from 'html-to-text';
import * as nodemailer from 'nodemailer';

import { EnvConfig } from '../../../shared/config/configuration';

@Injectable()
export class MailService {
  private email: string;

  constructor(private readonly configService: ConfigService<EnvConfig>) {
    this.email = this.configService.getOrThrow('APP_EMAIL');
  }

  private transporter = nodemailer.createTransport({
    host: 'localhost',
    port: 2500,
    secure: false,
    tls: {
      rejectUnauthorized: false,
    },
  });

  async sendEmail({
    to,
    subject,
    html,
  }: {
    to: string;
    subject: string;
    html: string;
  }): Promise<void> {
    await this.transporter.sendMail({
      from: this.email,
      to,
      subject,
      html,
      text: convert(html),
    });
  }
}
