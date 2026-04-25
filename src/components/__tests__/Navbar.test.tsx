import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Navbar } from '../Navbar';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: 'en', changeLanguage: vi.fn() },
  }),
}));

beforeEach(() => {
  localStorage.clear();
  document.documentElement.classList.remove('dark');
});

afterEach(() => {
  localStorage.clear();
  document.documentElement.classList.remove('dark');
});

describe('Navbar', () => {
  it('renders all navigation links', () => {
    render(<Navbar />);

    expect(screen.getByText('nav.about')).toBeInTheDocument();
    expect(screen.getByText('nav.projects')).toBeInTheDocument();
    expect(screen.getByText('nav.skills')).toBeInTheDocument();
    expect(screen.getByText('nav.contact')).toBeInTheDocument();
  });

  it('adds the "dark" class to <html> when dark mode is toggled on', async () => {
    localStorage.setItem('theme', 'light');
    const user = userEvent.setup();
    render(<Navbar />);

    const themeButton = screen.getByRole('button', { name: '' });
    await user.click(themeButton);

    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(localStorage.getItem('theme')).toBe('dark');
  });

  it('removes the "dark" class from <html> when dark mode is toggled off', async () => {
    localStorage.setItem('theme', 'dark');
    document.documentElement.classList.add('dark');
    const user = userEvent.setup();
    render(<Navbar />);

    const themeButton = screen.getByRole('button', { name: '' });
    await user.click(themeButton);

    expect(document.documentElement.classList.contains('dark')).toBe(false);
    expect(localStorage.getItem('theme')).toBe('light');
  });

  it('renders the DS. brand link', () => {
    render(<Navbar />);
    expect(screen.getByText('DS.')).toBeInTheDocument();
  });
});
