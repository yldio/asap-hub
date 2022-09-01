import { render, screen } from '@testing-library/react';
import ProjectsPage from '../ProjectsPage';

describe('ProjectsPage', () => {
  it('renders a banner', () => {
    render(<ProjectsPage />);
    expect(screen.getByRole('banner')).toBeVisible();
  });
});
