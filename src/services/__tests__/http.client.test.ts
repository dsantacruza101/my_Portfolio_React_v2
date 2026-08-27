import { describe, it, expect, vi, beforeEach } from 'vitest';
import { firstValueFrom } from 'rxjs';
import { HttpClient } from '../http.client';

let client: HttpClient;

beforeEach(() => {
  vi.restoreAllMocks();
  client = new HttpClient();
});

describe('HttpClient — request interceptors', () => {
  it('prepends /api to every request path by default', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, text: async () => '' });
    vi.stubGlobal('fetch', fetchMock);

    await client.get('/items');

    const [url] = fetchMock.mock.calls[0] as [string];
    expect(url).toContain('/api/items');
  });

  it('applies multiple interceptors in registration order', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, text: async () => '' });
    vi.stubGlobal('fetch', fetchMock);

    client.addRequestInterceptor((ctx) => ({ ...ctx, url: `${ctx.url}/v1` }));

    await client.get('/items');

    const [url] = fetchMock.mock.calls[0] as [string];
    expect(url).toContain('/api/items/v1');
  });

  it('addRequestInterceptor returns the client instance for chaining', () => {
    const result = client.addRequestInterceptor((ctx) => ctx);
    expect(result).toBe(client);
  });
});

describe('HttpClient — request', () => {
  it('sets Content-Type to application/json', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, text: async () => '' });
    vi.stubGlobal('fetch', fetchMock);

    await client.get('/test');

    const [, options] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect((options.headers as Record<string, string>)['Content-Type']).toBe('application/json');
  });

  it('merges caller-supplied headers without overwriting Content-Type', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, text: async () => '' });
    vi.stubGlobal('fetch', fetchMock);

    await client.get('/test', { headers: { Authorization: 'Bearer token' } });

    const [, options] = fetchMock.mock.calls[0] as [string, RequestInit];
    const headers = options.headers as Record<string, string>;
    expect(headers['Content-Type']).toBe('application/json');
    expect(headers['Authorization']).toBe('Bearer token');
  });

  it('serializes the body to JSON', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, text: async () => '' });
    vi.stubGlobal('fetch', fetchMock);

    await client.post('/test', { name: 'Daniel' });

    const [, options] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(options.body).toBe(JSON.stringify({ name: 'Daniel' }));
  });

  it('does not set body when none is provided', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, text: async () => '' });
    vi.stubGlobal('fetch', fetchMock);

    await client.get('/test');

    const [, options] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(options.body).toBeUndefined();
  });

  it('parses a JSON response body', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      text: async () => JSON.stringify({ id: 1 }),
    }));

    const result = await client.get<{ id: number }>('/test');
    expect(result).toEqual({ id: 1 });
  });

  it('returns undefined for an empty response body', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, text: async () => '' }));

    const result = await client.get('/test');
    expect(result).toBeUndefined();
  });

  it('throws the server message on non-2xx response', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      status: 422,
      json: async () => ({ message: 'Validation failed' }),
    }));

    await expect(client.post('/test', {})).rejects.toThrow('Validation failed');
  });

  it('falls back to a generic message when the error body is not JSON', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => { throw new Error(); },
    }));

    await expect(client.post('/test', {})).rejects.toThrow('Request failed with status 500');
  });
});

describe('HttpClient — custom config', () => {
  it('uses the provided baseUrl instead of VITE_API_BASE_URL', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, text: async () => '' });
    vi.stubGlobal('fetch', fetchMock);

    const customClient = new HttpClient({ baseUrl: 'https://chat.example.com' });
    await customClient.get('/chat');

    const [url] = fetchMock.mock.calls[0] as [string];
    expect(url.startsWith('https://chat.example.com')).toBe(true);
  });

  it('skips the /api prefix when useApiPrefix is false', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, text: async () => '' });
    vi.stubGlobal('fetch', fetchMock);

    const customClient = new HttpClient({ baseUrl: 'https://chat.example.com', useApiPrefix: false });
    await customClient.post('/chat', { message: 'hi' });

    const [url] = fetchMock.mock.calls[0] as [string];
    expect(url).toBe('https://chat.example.com/chat');
  });

  it('still applies the /api prefix by default when only baseUrl is overridden', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, text: async () => '' });
    vi.stubGlobal('fetch', fetchMock);

    const customClient = new HttpClient({ baseUrl: 'https://chat.example.com' });
    await customClient.get('/chat');

    const [url] = fetchMock.mock.calls[0] as [string];
    expect(url).toBe('https://chat.example.com/api/chat');
  });
});

describe('HttpClient — get', () => {
  it('sends a GET request', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, text: async () => '' });
    vi.stubGlobal('fetch', fetchMock);

    await client.get('/items');

    const [, options] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(options.method).toBe('GET');
  });
});

describe('HttpClient — post', () => {
  it('sends a POST request', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, text: async () => '' });
    vi.stubGlobal('fetch', fetchMock);

    await client.post('/items', { name: 'test' });

    const [, options] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(options.method).toBe('POST');
  });
});

describe('HttpClient — get$/post$', () => {
  it('get$ emits the parsed response body and completes', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      text: async () => JSON.stringify({ id: 1 }),
    }));

    await expect(firstValueFrom(client.get$<{ id: number }>('/test'))).resolves.toEqual({ id: 1 });
  });

  it('post$ emits the parsed response body and completes', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      text: async () => JSON.stringify({ id: 2 }),
    }));

    await expect(
      firstValueFrom(client.post$<{ id: number }>('/test', { name: 'Daniel' }))
    ).resolves.toEqual({ id: 2 });
  });

  it('aborts the underlying fetch when unsubscribed before the response resolves', () => {
    const fetchMock = vi.fn().mockReturnValue(new Promise(() => {}));
    vi.stubGlobal('fetch', fetchMock);

    const subscription = client.get$('/test').subscribe();
    subscription.unsubscribe();

    const [, options] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect((options.signal as AbortSignal).aborted).toBe(true);
  });
});
