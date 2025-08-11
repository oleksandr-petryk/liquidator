import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { convert } from 'html-to-text';
import * as nodemailer from 'nodemailer';

import { EnvConfig } from '../../../shared/config/configuration';

@Injectable()
export class MailService {
  private email: string;
  private host: string;
  private port: number;
  private secure: boolean;
  private transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService<EnvConfig>) {
    this.email = this.configService.getOrThrow('EMAIL_FROM');
    this.host = this.configService.getOrThrow('EMAIL_HOST');
    this.port = this.configService.getOrThrow('EMAIL_PORT');
    this.secure = this.configService.getOrThrow('EMAIL_SECURE');

    this.transporter = nodemailer.createTransport({
      host: this.host,
      port: this.port,
      secure: this.secure,
      tls: {
        rejectUnauthorized: false,
      },
    });
  }

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
