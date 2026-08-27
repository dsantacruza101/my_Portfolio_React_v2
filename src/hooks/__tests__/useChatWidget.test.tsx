import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import type { FormEvent } from 'react';
import { from, throwError, Subject } from 'rxjs';
import { useChatWidget } from '../useChatWidget';
import { chatService } from '../../services/chat.service';
import toast from 'react-hot-toast';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock('react-hot-toast', () => ({
  default: { error: vi.fn() },
}));

vi.mock('../../services/chat.service', () => ({
  chatService: { sendMessage: vi.fn() },
}));

const fakeFormEvent = { preventDefault: vi.fn() } as unknown as FormEvent<HTMLFormElement>;

beforeEach(() => vi.clearAllMocks());

describe('useChatWidget', () => {
  it('starts closed, with no messages and not loading', () => {
    const { result } = renderHook(() => useChatWidget());

    expect(result.current.isOpen).toBe(false);
    expect(result.current.messages).toEqual([]);
    expect(result.current.isLoading).toBe(false);
  });

  it('toggleOpen flips isOpen', () => {
    const { result } = renderHook(() => useChatWidget());

    act(() => result.current.toggleOpen());
    expect(result.current.isOpen).toBe(true);

    act(() => result.current.toggleOpen());
    expect(result.current.isOpen).toBe(false);
  });

  it('does nothing when sending a blank message', () => {
    const { result } = renderHook(() => useChatWidget());

    act(() => result.current.handleSend(fakeFormEvent));

    expect(chatService.sendMessage).not.toHaveBeenCalled();
    expect(result.current.messages).toEqual([]);
  });

  it('appends the user message immediately and the assistant reply on success', async () => {
    vi.mocked(chatService.sendMessage).mockReturnValue(from(Promise.resolve({ answer: 'Here is the answer.' })));
    const { result } = renderHook(() => useChatWidget());

    act(() => result.current.setInput('What does Daniel do?'));
    act(() => result.current.handleSend(fakeFormEvent));

    expect(result.current.messages).toHaveLength(1);
    expect(result.current.messages[0]).toMatchObject({ role: 'user', content: 'What does Daniel do?' });
    expect(result.current.input).toBe('');
    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.messages).toHaveLength(2);
    expect(result.current.messages[1]).toMatchObject({ role: 'assistant', content: 'Here is the answer.' });
  });

  it('appends an error bubble and shows a toast on failure', async () => {
    vi.mocked(chatService.sendMessage).mockReturnValue(throwError(() => new Error('Network error')));
    const { result } = renderHook(() => useChatWidget());

    act(() => result.current.setInput('Hello'));
    act(() => result.current.handleSend(fakeFormEvent));

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.messages[1]).toMatchObject({ role: 'assistant', content: 'chat.error' });
    expect(toast.error).toHaveBeenCalledWith('chat.error');
  });

  it('ignores a second send while a request is already in flight', async () => {
    const subject = new Subject<{ answer: string }>();
    vi.mocked(chatService.sendMessage).mockReturnValue(subject.asObservable());
    const { result } = renderHook(() => useChatWidget());

    act(() => result.current.setInput('First'));
    act(() => result.current.handleSend(fakeFormEvent));
    act(() => result.current.setInput('Second'));
    act(() => result.current.handleSend(fakeFormEvent));

    expect(chatService.sendMessage).toHaveBeenCalledOnce();

    await act(async () => {
      subject.next({ answer: 'done' });
      subject.complete();
    });
  });

  it('closes the panel on Escape while open', () => {
    const { result } = renderHook(() => useChatWidget());

    act(() => result.current.toggleOpen());
    expect(result.current.isOpen).toBe(true);

    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    });

    expect(result.current.isOpen).toBe(false);
  });
});
