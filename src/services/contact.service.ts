import { httpClient } from './http.client';
import type { 
  IContactService, 
  ContactMePayload 
} from '../types';

class ContactService implements IContactService {
  sendMessage(payload: ContactMePayload): Promise<void> {
    return httpClient.post('/portfolio/contact-me', payload);
  }
}

export const contactService: IContactService = new ContactService();
