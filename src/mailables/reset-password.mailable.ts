import fs from "fs";
import path from "path";

export interface IMailable {
  buildSubject(): string;
  buildBodyText(): string;
  buildBodyHTML(): string;
}

export default class ResetPasswordMailable implements IMailable {
  private readonly subject: string;
  private readonly htmlTemplate: string;
  private readonly textTemplate: string;

  constructor(
    private readonly resetCode: string,
    private readonly userName: string
  ) {
    this.subject = "Reset Your Password - Sport Booking";

    const htmlPath = path.join(__dirname, "html-templates/reset-password.html");
    const textPath = path.join(__dirname, "text-templates/reset-password.html");

    // Synchronously load templates in constructor
    this.htmlTemplate = fs.readFileSync(htmlPath, "utf8");
    this.textTemplate = fs.readFileSync(textPath, "utf8");
  }

  buildSubject(): string {
    return this.subject;
  }

  buildBodyText(): string {
    return this.replacePlaceholders(this.textTemplate);
  }

  buildBodyHTML(): string {
    return this.replacePlaceholders(this.htmlTemplate);
  }

  private replacePlaceholders(template: string): string {
    return template
      .replace(/{{ resetCode }}/g, this.resetCode)
      .replace(/{{ userName }}/g, this.userName);
  }
}
