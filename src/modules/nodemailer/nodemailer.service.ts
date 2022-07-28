import { Injectable } from '@nestjs/common'
import { createTransport, Transporter } from 'nodemailer'
import { Attachment } from 'nodemailer/lib/mailer'
import SMTPTransport from 'nodemailer/lib/smtp-transport'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class NodemailerService {
  private transporter: Transporter<SMTPTransport.SentMessageInfo>

  constructor(private readonly configService: ConfigService) {
    this.transporter = createTransport({
      host: configService.get('NODEMAILER_HOST'),
      port: configService.get('NODEMAILER_PORT'),
      secure: configService.get('NODEMAILER_SECURE'),
      auth: {
        user: configService.get('NODEMAILER_USER'),
        pass: configService.get('NODEMAILER_PASS'),
      },
    })
  }

  send(
    recipient: string,
    content: { subject: string; html: string; attachments?: Attachment[] },
  ): Promise<SMTPTransport.SentMessageInfo> {
    return this.transporter.sendMail({
      to: recipient,
      subject: content.subject,
      html: content.html,
      attachments: content.attachments,
    })
  }
}
