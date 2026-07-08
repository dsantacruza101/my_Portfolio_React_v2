import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { About } from '../About';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

describe('About', () => {
  it('renders the section heading', () => {
    render(<About />);
    expect(screen.getByRole('heading', { name: 'about.title' })).toBeInTheDocument();
  });

  it('renders the profile image', () => {
    render(<About />);
    expect(screen.getByAltText('Daniel Santacruz')).toBeInTheDocument();
  });

  it('renders the biography description', () => {
    render(<About />);
    expect(screen.getByText('about.description')).toBeInTheDocument();
  });

  it('renders the "+4" years of experience badge', () => {
    render(<About />);
    expect(screen.getByText('+4')).toBeInTheDocument();
  });

  it('renders the experience highlight with correct detail', () => {
    render(<About />);
    expect(screen.getByText('MRE El Salvador')).toBeInTheDocument();
  });

  it('renders the specialty highlight with correct detail', () => {
    render(<About />);
    expect(screen.getByText('Full Stack Developer')).toBeInTheDocument();
  });

  it('renders the education highlight', () => {
    render(<About />);
    // detail is t("hero.role") which the mock returns as "hero.role"
    expect(screen.getByText('hero.role')).toBeInTheDocument();
  });
});
