import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProjectCard } from '../ProjectCards';
import type { Project } from '../../types';

const baseProject: Project = {
  id: '1',
  title: 'Test Project',
  description: 'A test project description.',
  tags: ['React', 'TypeScript'],
};

describe('ProjectCard', () => {
  it('renders the project title and description', () => {
    render(<ProjectCard project={baseProject} />);

    expect(screen.getByText('Test Project')).toBeInTheDocument();
    expect(screen.getByText('A test project description.')).toBeInTheDocument();
  });

  it('renders all technology tags', () => {
    render(<ProjectCard project={baseProject} />);

    expect(screen.getByText('#React')).toBeInTheDocument();
    expect(screen.getByText('#TypeScript')).toBeInTheDocument();
  });

  it('shows the WIP badge when isWip is true', () => {
    render(<ProjectCard project={{ ...baseProject, isWip: true }} />);

    expect(screen.getByText('WIP')).toBeInTheDocument();
  });

  it('does not show the WIP badge when isWip is false', () => {
    render(<ProjectCard project={{ ...baseProject, isWip: false }} />);

    expect(screen.queryByText('WIP')).not.toBeInTheDocument();
  });

  it('shows a "Coming Soon" placeholder when no image is provided', () => {
    render(<ProjectCard project={baseProject} />);

    expect(screen.getByText('Coming Soon')).toBeInTheDocument();
  });

  it('renders the project image when provided', () => {
    render(<ProjectCard project={{ ...baseProject, image: '/projects/test.png' }} />);

    const img = screen.getByRole('img', { name: 'Test Project' });
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', '/projects/test.png');
  });

  it('renders the GitHub link when githubUrl is provided', () => {
    render(<ProjectCard project={{ ...baseProject, githubUrl: 'https://github.com/test' }} />);

    const link = screen.getByRole('link', { name: /code/i });
    expect(link).toHaveAttribute('href', 'https://github.com/test');
  });

  it('renders the Demo link when demoUrl is provided', () => {
    render(<ProjectCard project={{ ...baseProject, demoUrl: 'https://demo.test.com' }} />);

    const link = screen.getByRole('link', { name: /demo/i });
    expect(link).toHaveAttribute('href', 'https://demo.test.com');
  });

  it('does not render Code or Demo links when URLs are absent', () => {
    render(<ProjectCard project={baseProject} />);

    expect(screen.queryByRole('link', { name: /code/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /demo/i })).not.toBeInTheDocument();
  });
});
