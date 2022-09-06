import {
  createProjectResponse,
  createProjectsResponse,
} from '@asap-hub/fixtures';
import { render, screen } from '@testing-library/react';
import ProjectsBody from '../ProjectsBody';

describe('ProjectsBody', () => {
  it('renders a working group', () => {
    render(<ProjectsBody projects={createProjectsResponse()} />);
    expect(
      screen.getByRole('heading', { name: /Project Title/i }),
    ).toBeVisible();
  });

  it('renders multiple working groups', () => {
    const projects = [
      createProjectResponse({ id: '11', title: 'Project 11' }),
      createProjectResponse({ id: '42', title: 'Project 42' }),
    ];

    const projectsResponse = createProjectsResponse(projects);

    render(<ProjectsBody projects={projectsResponse} />);
    expect(screen.getByRole('heading', { name: /Project 11/i })).toBeVisible();
    expect(screen.getByRole('heading', { name: /Project 42/i })).toBeVisible();
  });
});
