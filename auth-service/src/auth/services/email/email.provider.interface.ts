export interface EmailData {
  from: string;
  to: string;
  subject: string;
  html?: string;
  text?: string;
}

export interface EmailProvider {
  sendMail(data: EmailData): Promise<void>;
}
