import { describe, it, expect, vi, beforeEach } from 'vitest';
import { contactService } from '../contact.service';
import { httpClient } from '../http.client';

vi.mock('../http.client', () => ({
  httpClient: { post: vi.fn() },
}));

const payload = {
  name: 'Daniel Santacruz',
  email: 'daniel@example.com',
  subject: 'Hello there',
  message: 'This is a test message',
  captchaToken: 'test-token',
};

beforeEach(() => vi.clearAllMocks());

describe('ContactService.sendMessage', () => {
  it('delegates to httpClient.post with the correct path and payload', async () => {
    vi.mocked(httpClient.post).mockResolvedValue(undefined);

    await contactService.sendMessage(payload);

    expect(httpClient.post).toHaveBeenCalledOnce();
    expect(httpClient.post).toHaveBeenCalledWith('/portfolio/contact-me', payload);
  });

  it('resolves without throwing on success', async () => {
    vi.mocked(httpClient.post).mockResolvedValue(undefined);

    await expect(contactService.sendMessage(payload)).resolves.toBeUndefined();
  });

  it('propagates errors thrown by httpClient', async () => {
    vi.mocked(httpClient.post).mockRejectedValue(new Error('Network error'));

    await expect(contactService.sendMessage(payload)).rejects.toThrow('Network error');
  });
});
