import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, within, fireEvent } from '@testing-library/react';
import { ChatWidget } from '../ChatWidget';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

const mockUseChatWidget = vi.hoisted(() => vi.fn());

vi.mock('../../hooks/useChatWidget', () => ({
  useChatWidget: mockUseChatWidget,
}));

const defaultState = {
  isOpen: false,
  toggleOpen: vi.fn(),
  close: vi.fn(),
  messages: [],
  input: '',
  setInput: vi.fn(),
  isLoading: false,
  handleSend: vi.fn(),
  panelRef: { current: null },
  toggleButtonRef: { current: null },
  inputRef: { current: null },
};

beforeEach(() => {
  vi.clearAllMocks();
  mockUseChatWidget.mockReturnValue({ ...defaultState });
});

describe('ChatWidget', () => {
  it('renders the closed toggle button with no panel', () => {
    render(<ChatWidget />);

    expect(screen.getByRole('button', { name: 'chat.open' })).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('calls toggleOpen when the FAB is clicked', () => {
    render(<ChatWidget />);

    fireEvent.click(screen.getByRole('button', { name: 'chat.open' }));
    expect(defaultState.toggleOpen).toHaveBeenCalledOnce();
  });

  it('renders the dialog with the greeting when open and empty', () => {
    mockUseChatWidget.mockReturnValue({ ...defaultState, isOpen: true });
    render(<ChatWidget />);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('chat.greeting')).toBeInTheDocument();
  });

  it('renders each message when the conversation is non-empty', () => {
    mockUseChatWidget.mockReturnValue({
      ...defaultState,
      isOpen: true,
      messages: [
        { id: '1', role: 'user', content: 'Hello there' },
        { id: '2', role: 'assistant', content: 'Hi, how can I help?' },
      ],
    });
    render(<ChatWidget />);

    expect(screen.getByText('Hello there')).toBeInTheDocument();
    expect(screen.getByText('Hi, how can I help?')).toBeInTheDocument();
    expect(screen.queryByText('chat.greeting')).not.toBeInTheDocument();
  });

  it('disables the send button when the input is empty', () => {
    mockUseChatWidget.mockReturnValue({ ...defaultState, isOpen: true });
    render(<ChatWidget />);

    expect(screen.getByRole('button', { name: 'chat.send' })).toBeDisabled();
  });

  it('enables the send button once there is input and not loading', () => {
    mockUseChatWidget.mockReturnValue({ ...defaultState, isOpen: true, input: 'Hello' });
    render(<ChatWidget />);

    expect(screen.getByRole('button', { name: 'chat.send' })).not.toBeDisabled();
  });

  it('disables the send button and input while loading', () => {
    mockUseChatWidget.mockReturnValue({ ...defaultState, isOpen: true, input: 'Hello', isLoading: true });
    render(<ChatWidget />);

    expect(screen.getByRole('button', { name: 'chat.send' })).toBeDisabled();
    expect(screen.getByPlaceholderText('chat.placeholder')).toBeDisabled();
  });

  it('calls close when the header close button is clicked', () => {
    mockUseChatWidget.mockReturnValue({ ...defaultState, isOpen: true });
    render(<ChatWidget />);

    const dialog = screen.getByRole('dialog');
    fireEvent.click(within(dialog).getByRole('button', { name: 'chat.close' }));
    expect(defaultState.close).toHaveBeenCalledOnce();
  });

  it('calls handleSend on form submission', () => {
    mockUseChatWidget.mockReturnValue({ ...defaultState, isOpen: true, input: 'Hello' });
    render(<ChatWidget />);

    fireEvent.submit(screen.getByPlaceholderText('chat.placeholder').closest('form')!);
    expect(defaultState.handleSend).toHaveBeenCalledOnce();
  });
});
