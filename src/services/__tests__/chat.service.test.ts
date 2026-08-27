import { describe, it, expect, vi, beforeEach } from 'vitest';
import { of, throwError, firstValueFrom } from 'rxjs';
import { chatService } from '../chat.service';
import { httpClient } from '../http.client';

vi.mock('../http.client', () => ({
  httpClient: { post$: vi.fn() },
}));

const payload = { message: 'What technologies does Daniel use?' };

beforeEach(() => vi.clearAllMocks());

describe('ChatService.sendMessage', () => {
  it('delegates to httpClient.post$ with the correct path and payload', async () => {
    vi.mocked(httpClient.post$).mockReturnValue(of({ answer: 'React, TypeScript, and more.' }));

    await firstValueFrom(chatService.sendMessage(payload));

    expect(httpClient.post$).toHaveBeenCalledOnce();
    expect(httpClient.post$).toHaveBeenCalledWith('/ai/chat', payload);
  });

  it('resolves with the response returned by httpClient', async () => {
    vi.mocked(httpClient.post$).mockReturnValue(of({ answer: 'React, TypeScript, and more.' }));

    await expect(firstValueFrom(chatService.sendMessage(payload))).resolves.toEqual({
      answer: 'React, TypeScript, and more.',
    });
  });

  it('propagates errors thrown by httpClient', async () => {
    vi.mocked(httpClient.post$).mockReturnValue(throwError(() => new Error('Network error')));

    await expect(firstValueFrom(chatService.sendMessage(payload))).rejects.toThrow('Network error');
  });
});
