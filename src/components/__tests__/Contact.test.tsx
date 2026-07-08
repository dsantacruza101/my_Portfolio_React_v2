import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Contact } from '../Contact';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock('@hcaptcha/react-hcaptcha', () => ({
  default: () => <div data-testid="hcaptcha" />,
}));

vi.mock('../../hooks/useDarkMode', () => ({
  useDarkMode: () => false,
}));

const mockUseContactForm = vi.hoisted(() => vi.fn());

vi.mock('../../hooks/useContactForm', () => ({
  useContactForm: mockUseContactForm,
}));

const defaultFormState = {
  register: vi.fn().mockImplementation((name: string) => ({ name })),
  handleSubmit: vi.fn(),
  errors: {},
  isSubmitting: false,
  captchaRef: { current: null },
  onCaptchaVerify: vi.fn(),
  onCaptchaExpire: vi.fn(),
  captchaToken: null,
  cooldown: false,
};

beforeEach(() => {
  vi.clearAllMocks();
  mockUseContactForm.mockReturnValue({ ...defaultFormState });
});

describe('Contact', () => {
  it('renders the section heading', () => {
    render(<Contact />);
    expect(screen.getByRole('heading', { name: 'contact.title' })).toBeInTheDocument();
  });

  it('renders the subtitle', () => {
    render(<Contact />);
    expect(screen.getByText('contact.subtitle')).toBeInTheDocument();
  });

  it('renders the name input', () => {
    render(<Contact />);
    expect(screen.getByPlaceholderText('Daniel Santacruz')).toBeInTheDocument();
  });

  it('renders the email input', () => {
    render(<Contact />);
    expect(screen.getByPlaceholderText('daniel@example.com')).toBeInTheDocument();
  });

  it('renders the hCaptcha widget', () => {
    render(<Contact />);
    expect(screen.getByTestId('hcaptcha')).toBeInTheDocument();
  });

  it('renders the submit button in its default state', () => {
    render(<Contact />);
    expect(screen.getByRole('button', { name: /contact\.send/i })).not.toBeDisabled();
  });

  it('disables the submit button while the form is submitting', () => {
    mockUseContactForm.mockReturnValue({ ...defaultFormState, isSubmitting: true });
    render(<Contact />);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('disables the submit button during cooldown and shows the cooldown message', () => {
    mockUseContactForm.mockReturnValue({ ...defaultFormState, cooldown: true });
    render(<Contact />);

    const btn = screen.getByRole('button');
    expect(btn).toBeDisabled();
    expect(btn).toHaveTextContent('contact.cooldown');
  });

  it('shows a field-level error when the name error is set', () => {
    mockUseContactForm.mockReturnValue({
      ...defaultFormState,
      errors: { name: { message: 'name_error' } },
    });
    render(<Contact />);
    expect(screen.getByText('contact.errors.name_error')).toBeInTheDocument();
  });
});
