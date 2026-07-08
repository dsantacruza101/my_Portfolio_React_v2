import { httpClient } from './http.client';
import type { 
  IContactService, 
  ContactMePayload 
} from '../types';

/** Concrete implementation of {@link IContactService} that delegates HTTP calls to {@link httpClient}. */
class ContactService implements IContactService {
  /**
   * Sends a contact form payload to the portfolio API endpoint.
   * @param payload - Form data including the verified captcha token.
   */
  sendMessage(payload: ContactMePayload): Promise<void> {
    return httpClient.post('/portfolio/contact-me', payload);
  }
}

export const contactService: IContactService = new ContactService();
