import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useContactForm } from '../useContactForm';
import { contactService } from '../../services/contact.service';
import toast from 'react-hot-toast';

vi.mock('../../services/contact.service', () => ({
  contactService: { sendMessage: vi.fn() },
}));

vi.mock('react-hot-toast', () => ({
  default: {
    loading: vi.fn(() => 'toast-id'),
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

function TestForm() {
  const { register, handleSubmit, errors, isSubmitting } = useContactForm();
  return (
    <form onSubmit={handleSubmit}>
      <input {...register('name')} placeholder="name" />
      {errors.name && <span role="alert">{errors.name.message}</span>}
      <input {...register('email')} placeholder="email" />
      {errors.email && <span role="alert">{errors.email.message}</span>}
      <input {...register('subject')} placeholder="subject" />
      {errors.subject && <span role="alert">{errors.subject.message}</span>}
      <textarea {...register('message')} placeholder="message" />
      {errors.message && <span role="alert">{errors.message.message}</span>}
      <button type="submit" disabled={isSubmitting}>send</button>
    </form>
  );
}

async function fillAndSubmit(overrides: Record<string, string> = {}) {
  const user = userEvent.setup();
  const values = {
    name: 'Daniel Santacruz',
    email: 'daniel@example.com',
    subject: 'Hello there',
    message: 'This is a long enough test message',
    ...overrides,
  };
  await user.type(screen.getByPlaceholderText('name'), values.name);
  await user.type(screen.getByPlaceholderText('email'), values.email);
  await user.type(screen.getByPlaceholderText('subject'), values.subject);
  await user.type(screen.getByPlaceholderText('message'), values.message);
  await user.click(screen.getByRole('button', { name: 'send' }));
}

beforeEach(() => {
  vi.clearAllMocks();
  render(<TestForm />);
});

describe('useContactForm', () => {
  it('calls contactService.sendMessage with form data on valid submit', async () => {
    vi.mocked(contactService.sendMessage).mockResolvedValue(undefined);

    await fillAndSubmit();

    await waitFor(() => {
      expect(contactService.sendMessage).toHaveBeenCalledWith({
        name: 'Daniel Santacruz',
        email: 'daniel@example.com',
        subject: 'Hello there',
        message: 'This is a long enough test message',
      });
    });
  });

  it('shows a success toast when sendMessage resolves', async () => {
    vi.mocked(contactService.sendMessage).mockResolvedValue(undefined);

    await fillAndSubmit();

    await waitFor(() => expect(toast.success).toHaveBeenCalled());
  });

  it('shows an error toast when sendMessage rejects', async () => {
    vi.mocked(contactService.sendMessage).mockRejectedValue(new Error('Network error'));

    await fillAndSubmit();

    await waitFor(() => expect(toast.error).toHaveBeenCalled());
  });

  it('shows validation errors when required fields are too short', async () => {
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: 'send' }));

    await waitFor(() => {
      expect(screen.getAllByRole('alert').length).toBeGreaterThan(0);
    });
    expect(contactService.sendMessage).not.toHaveBeenCalled();
  });
});
