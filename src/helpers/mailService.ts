import nodemailer, { Transporter } from "nodemailer";
import { env } from "../config/envConfig";

interface MailOptions {
  cc?: string[];
  attachments?: any[];
}

export class Mailer {
  private transporter: Transporter;
  private fromName: string;
  private fromEmail: string;

  constructor(
    host: string = env.SMTP_HOST!,
    port: number = Number(env.SMTP_PORT),
    user: string = env.SMTP_USER!,
    pass: string = env.SMTP_PASSWORD!,
    fromName: string = env.SMTP_FROM_NAME!
  ) {
    this.transporter = nodemailer.createTransport({
      pool: true,
      maxConnections: 1,
      host,
      port,
      secure: false,
      auth: { user, pass },
    });

    this.fromName = fromName;
    this.fromEmail = user;
  }

  async send(
    to: string,
    mailable: any,
    options: MailOptions = {}
  ): Promise<string> {
    const { cc = [], attachments = [] } = options;
    const subject = mailable.buildSubject();

    console.info(`Sending email '${subject}' to '${to}'`);

    try {
      await this.transporter.sendMail({
        from: `"${this.fromName}" <${this.fromEmail}>`,
        to,
        cc,
        subject,
        text: mailable.buildBodyText(),
        html: mailable.buildBodyHTML(),
        attachments,
      });

      return to;
    } catch (error) {
      console.error("Error sending email:", error);
      throw error;
    }
  }

  async directSend(
    to: string,
    subject: string,
    content: string
  ): Promise<string> {
    console.info(`[Mail] Simply sending email '${subject}' to '${to}'`);

    try {
      await this.transporter.sendMail({
        from: `"${this.fromName}" <${this.fromEmail}>`,
        to,
        subject,
        text: content,
        html: content,
      });

      return to;
    } catch (error) {
      console.error("[Mail] Error sending email:", error);
      throw error;
    }
  }

  close(): void {
    this.transporter.close();
  }
}
