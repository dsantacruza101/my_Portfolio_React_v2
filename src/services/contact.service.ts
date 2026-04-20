export interface ContactMePayload {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface IContactService {
  sendMessage(payload: ContactMePayload): Promise<void>;
}

class ContactService implements IContactService {
  private readonly baseUrl: string;

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_BASE_URL as string;
  }

  async sendMessage(payload: ContactMePayload): Promise<void> {
    const response = await fetch(`${this.baseUrl}/portfolio/contact-me`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => null) as { message?: string } | null;
      throw new Error(error?.message ?? `Request failed with status ${response.status}`);
    }
  }
}

export const contactService: IContactService = new ContactService();
