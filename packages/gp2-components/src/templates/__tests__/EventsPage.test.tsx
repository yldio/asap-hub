import { render, screen } from '@testing-library/react';
import EventsPage from '../EventsPage';

describe('ProjectDetailPage', () => {
  it('renders header', () => {
    render(<EventsPage />);
    expect(screen.getByRole('banner')).toBeVisible();
  });
});
