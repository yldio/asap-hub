import { render, screen } from '@testing-library/react';
import ProjectsHeader from '../ProjectsHeader';

describe('ProjectsHeader', () => {
  it('renders a banner', () => {
    render(<ProjectsHeader />);
    expect(screen.getByRole('banner')).toBeVisible();
  });
});
