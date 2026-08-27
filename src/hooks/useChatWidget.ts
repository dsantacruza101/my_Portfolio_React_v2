import { useEffect, useRef, useState, type FormEvent, type RefObject } from 'react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { finalize, type Subscription } from 'rxjs';
import { chatService } from '../services/chat.service';
import type { ChatMessage } from '../types';

export interface UseChatWidgetResult {
  isOpen: boolean;
  toggleOpen: () => void;
  close: () => void;
  messages: ChatMessage[];
  input: string;
  setInput: (value: string) => void;
  isLoading: boolean;
  handleSend: (e: FormEvent<HTMLFormElement>) => void;
  panelRef: RefObject<HTMLDivElement | null>;
  toggleButtonRef: RefObject<HTMLButtonElement | null>;
  inputRef: RefObject<HTMLInputElement | null>;
}

/**
 * Manages the floating chat widget's open/closed state, conversation history,
 * and submission to the RAG chat backend via {@link chatService}.
 *
 * Handles Escape-to-close and click-outside-to-close while open, and
 * autofocuses the input whenever the panel opens.
 */
export function useChatWidget(): UseChatWidgetResult {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const nextId = useRef(0);
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleButtonRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const subscriptionRef = useRef<Subscription | null>(null);

  const toggleOpen = () => setIsOpen((prev) => !prev);
  const close = () => setIsOpen(false);

  const pushMessage = (role: ChatMessage['role'], content: string) => {
    nextId.current += 1;
    setMessages((prev) => [...prev, { id: `msg-${nextId.current}`, role, content }]);
  };

  const handleSend = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    pushMessage('user', trimmed);
    setInput('');
    setIsLoading(true);

    subscriptionRef.current = chatService
      .sendMessage({ message: trimmed })
      .pipe(finalize(() => setIsLoading(false)))
      .subscribe({
        next: (response) => pushMessage('assistant', response.answer),
        error: () => {
          pushMessage('assistant', t('chat.error'));
          toast.error(t('chat.error'));
        },
      });
  };

  useEffect(() => {
    return () => subscriptionRef.current?.unsubscribe();
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (panelRef.current?.contains(target)) return;
      if (toggleButtonRef.current?.contains(target)) return;
      close();
    };

    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  return {
    isOpen,
    toggleOpen,
    close,
    messages,
    input,
    setInput,
    isLoading,
    handleSend,
    panelRef,
    toggleButtonRef,
    inputRef,
  };
}
