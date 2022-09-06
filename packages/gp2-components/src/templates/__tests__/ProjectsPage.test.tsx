import { createProjectsResponse } from '@asap-hub/fixtures';
import { render, screen } from '@testing-library/react';
import ProjectsPage from '../ProjectsPage';

describe('ProjectsPage', () => {
  it('renders a banner', () => {
    render(<ProjectsPage projects={createProjectsResponse()} />);
    expect(screen.getByRole('banner')).toBeVisible();
  });
});
