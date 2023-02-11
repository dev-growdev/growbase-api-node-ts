import { appEnvironments, emailEnvironments } from '../../envs';
import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import hbs from 'nodemailer-express-handlebars';

export interface EmailData {
  to: string;
  cc?: string[];
  subject: string;
  partial: string;
  context: any;
}

export class GmailService {
  private transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo>;

  constructor() {
    const config: SMTPTransport.Options = {
      service: 'gmail',
      secure: true,
      auth: {
        user: emailEnvironments.EMAIL_ADDRESS,
        pass: emailEnvironments.EMAIL_PASS,
      },
    };
    this.transporter = nodemailer.createTransport(config);
  }

  async sendMail(data: EmailData): Promise<void> {
    const isProduction = appEnvironments.NODE_ENV?.toLocaleLowerCase() === 'production';
    const rootDir = isProduction ? 'dist' : 'src';

    const handlebarOptions = {
      viewEngine: {
        extName: '.handlebars',
        partialsDir: rootDir + '/app/shared/presentation/views/partials',
        layoutsDir: rootDir + '/app/shared/presentation/views/layouts',
        defaultLayout: 'default',
      },
      viewPath: './' + rootDir + '/app/shared/presentation/views/',
      extName: '.handlebars',
    };

    this.transporter.use('compile', hbs(handlebarOptions));

    const mailOptions = {
      from: {
        name: emailEnvironments.EMAIL_NAME,
        address: emailEnvironments.EMAIL_ADDRESS,
      },
      cc: data.cc,
      to: data.to,
      subject: data.subject,
      template: `partials/${data.partial}`,
      context: data.context,
    };

    this.transporter.sendMail(mailOptions, (err, info) => {
      console.log(err);
      console.log(info);
    });
  }
}
