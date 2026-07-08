import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Projects } from '../Projects';
import type { Project } from '../../types';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock('../ProjectCards', () => ({
  ProjectCard: ({ project }: { project: Project }) => (
    <div data-testid={`card-${project.id}`}>
      <span>{project.title}</span>
      {project.isWip && <span data-testid="wip-badge">WIP</span>}
    </div>
  ),
}));

describe('Projects', () => {
  it('renders the section heading', () => {
    render(<Projects />);
    expect(screen.getByRole('heading', { name: /projects\.title/i })).toBeInTheDocument();
  });

  it('renders all three project cards', () => {
    render(<Projects />);
    expect(screen.getByTestId('card-1')).toBeInTheDocument();
    expect(screen.getByTestId('card-2')).toBeInTheDocument();
    expect(screen.getByTestId('card-3')).toBeInTheDocument();
  });

  it('renders TechTrackApp project', () => {
    render(<Projects />);
    expect(screen.getByText('TechTrackApp')).toBeInTheDocument();
  });

  it('renders Portfolio Contact API project', () => {
    render(<Projects />);
    expect(screen.getByText('Portfolio Conctact API')).toBeInTheDocument();
  });

  it('renders Chat with IA + RAG project', () => {
    render(<Projects />);
    expect(screen.getByText('Chat with IA + RAG')).toBeInTheDocument();
  });

  it('marks the Chat with IA + RAG project as WIP', () => {
    render(<Projects />);
    // Only the third card (id=3) has isWip: true
    expect(screen.getByTestId('wip-badge')).toBeInTheDocument();
  });
});
