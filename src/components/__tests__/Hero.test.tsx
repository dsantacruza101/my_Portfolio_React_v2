import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Hero } from '../Hero';

const useTranslationMock = vi.hoisted(() => vi.fn());

vi.mock('react-i18next', () => ({
  useTranslation: useTranslationMock,
}));

const defaultI18n = {
  t: (key: string) => key,
  i18n: { language: 'en', changeLanguage: vi.fn() },
};

beforeEach(() => {
  useTranslationMock.mockReturnValue(defaultI18n);
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('Hero', () => {
  it('renders the full name', () => {
    render(<Hero />);
    expect(screen.getByText('Daniel')).toBeInTheDocument();
    expect(screen.getByText('Santacruz')).toBeInTheDocument();
  });

  it('renders the role badge', () => {
    render(<Hero />);
    expect(screen.getByText('hero.role')).toBeInTheDocument();
  });

  it('renders the "View Projects" button', () => {
    render(<Hero />);
    expect(screen.getByRole('button', { name: 'hero.cta_projects' })).toBeInTheDocument();
  });

  it('renders the download button', () => {
    render(<Hero />);
    expect(screen.getByRole('button', { name: /hero\.cta_download/i })).toBeInTheDocument();
  });

  it('renders the floating tech badges', () => {
    render(<Hero />);
    expect(screen.getByText('NestJS')).toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('Docker')).toBeInTheDocument();
  });

  it('renders the GitHub social link', () => {
    const { container } = render(<Hero />);
    expect(
      container.querySelector('a[href="https://github.com/dsantacruza101"]')
    ).toBeInTheDocument();
  });

  it('renders the LinkedIn social link', () => {
    const { container } = render(<Hero />);
    expect(
      container.querySelector('a[href="https://www.linkedin.com/in/daniel-santacruz-5a71a61a9/"]')
    ).toBeInTheDocument();
  });

  it('"View Projects" button scrolls to the projects section', async () => {
    const user = userEvent.setup();
    const scrollIntoViewMock = vi.fn();
    document.getElementById = vi.fn().mockReturnValue({ scrollIntoView: scrollIntoViewMock });

    render(<Hero />);
    await user.click(screen.getByRole('button', { name: 'hero.cta_projects' }));

    expect(scrollIntoViewMock).toHaveBeenCalledWith({ behavior: 'smooth' });
  });

  it('triggers a download and uses the English resume when language is "en"', async () => {
    const user = userEvent.setup();
    render(<Hero />);

    const mockAnchor = { href: '', download: '', click: vi.fn() };
    const originalCreateElement = document.createElement.bind(document);
    vi.spyOn(document, 'createElement').mockImplementation((tag: string) => {
      if (tag === 'a') return mockAnchor as unknown as HTMLAnchorElement;
      return originalCreateElement(tag);
    });

    await user.click(screen.getByRole('button', { name: /hero\.cta_download/i }));

    expect(mockAnchor.href).toBe('/Resume_Daniel_Santacruz_EN_v3.pdf');
    expect(mockAnchor.click).toHaveBeenCalledOnce();
  });

  it('uses the Spanish CV file when language is "es"', async () => {
    useTranslationMock.mockReturnValue({
      t: (key: string) => key,
      i18n: { language: 'es', changeLanguage: vi.fn() },
    });

    const user = userEvent.setup();
    render(<Hero />);

    const mockAnchor = { href: '', download: '', click: vi.fn() };
    const originalCreateElement = document.createElement.bind(document);
    vi.spyOn(document, 'createElement').mockImplementation((tag: string) => {
      if (tag === 'a') return mockAnchor as unknown as HTMLAnchorElement;
      return originalCreateElement(tag);
    });

    await user.click(screen.getByRole('button', { name: /hero\.cta_download/i }));

    expect(mockAnchor.href).toBe('/CV_Daniel_Santacruz_ES_v3.pdf');
  });
});
