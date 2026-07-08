import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Skills } from '../Skills';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock('../../data/data', () => ({
  SKILL_CATEGORIES: [
    { id: 'frontend', skills: ['React', 'TypeScript'] },
    { id: 'backend', skills: ['NestJS', 'Node.js'] },
    { id: 'devops', skills: ['Docker', 'GitHub Actions'] },
  ],
}));

describe('Skills', () => {
  it('renders the section heading', () => {
    render(<Skills />);
    expect(screen.getByRole('heading', { name: 'skills.title' })).toBeInTheDocument();
  });

  it('renders a category heading for each skill category', () => {
    render(<Skills />);
    expect(screen.getByText('skills.categories.frontend')).toBeInTheDocument();
    expect(screen.getByText('skills.categories.backend')).toBeInTheDocument();
    expect(screen.getByText('skills.categories.devops')).toBeInTheDocument();
  });

  it('renders skill badges within the frontend category', () => {
    render(<Skills />);
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
  });

  it('renders skill badges within the backend category', () => {
    render(<Skills />);
    expect(screen.getByText('NestJS')).toBeInTheDocument();
    expect(screen.getByText('Node.js')).toBeInTheDocument();
  });

  it('renders skill badges within the devops category', () => {
    render(<Skills />);
    expect(screen.getByText('Docker')).toBeInTheDocument();
    expect(screen.getByText('GitHub Actions')).toBeInTheDocument();
  });
});
