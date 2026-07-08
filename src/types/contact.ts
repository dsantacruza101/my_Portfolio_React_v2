/** Shape of the payload posted to the contact API endpoint. */
export interface ContactMePayload {
  name: string;
  email: string;
  subject: string;
  message: string;
  captchaToken: string;
}

/** Abstraction over the contact API, injected by components and replaced by mocks in tests. */
export interface IContactService {
  sendMessage(payload: ContactMePayload): Promise<void>;
}