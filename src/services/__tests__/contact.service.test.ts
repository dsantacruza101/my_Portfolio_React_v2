import { describe, it, expect, vi, beforeEach } from 'vitest';
import { contactService } from '../contact.service';

const payload = {
  name: 'Daniel Santacruz',
  email: 'daniel@example.com',
  subject: 'Hello there',
  message: 'This is a test message',
};

beforeEach(() => {
  vi.restoreAllMocks();
  import.meta.env.VITE_API_BASE_URL = 'http://localhost:3000';
});

describe('ContactService.sendMessage', () => {
  it('calls the correct endpoint with the right payload', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({}),
    });
    vi.stubGlobal('fetch', fetchMock);

    await contactService.sendMessage(payload);

    expect(fetchMock).toHaveBeenCalledOnce();
    const [url, options] = fetchMock.mock.calls[0];
    expect(url).toContain('/portfolio/contact-me');
    expect(options.method).toBe('POST');
    expect(options.headers['Content-Type']).toBe('application/json');
    expect(JSON.parse(options.body)).toEqual(payload);
  });

  it('resolves without throwing on a 2xx response', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => ({}) }));
    await expect(contactService.sendMessage(payload)).resolves.toBeUndefined();
  });

  it('throws an error with the server message on non-2xx response', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      status: 422,
      json: async () => ({ message: 'Invalid email address' }),
    }));

    await expect(contactService.sendMessage(payload)).rejects.toThrow('Invalid email address');
  });

  it('falls back to a generic error message when the response body is not JSON', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => { throw new Error('not json'); },
    }));

    await expect(contactService.sendMessage(payload)).rejects.toThrow('Request failed with status 500');
  });
});
