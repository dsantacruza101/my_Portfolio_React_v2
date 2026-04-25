export interface ContactMePayload {
  name: string;
  email: string;
  subject: string;
  message: string;
  captchaToken: string;
}

export interface IContactService {
  sendMessage(payload: ContactMePayload): Promise<void>;
}