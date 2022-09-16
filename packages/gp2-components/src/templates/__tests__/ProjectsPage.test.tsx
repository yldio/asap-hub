import { gp2 } from '@asap-hub/fixtures';
import { render, screen } from '@testing-library/react';
import ProjectsPage from '../ProjectsPage';

describe('ProjectsPage', () => {
  it('renders a banner', () => {
    render(<ProjectsPage projects={gp2.createProjectsResponse()} />);
    expect(screen.getByRole('banner')).toBeVisible();
  });
});
