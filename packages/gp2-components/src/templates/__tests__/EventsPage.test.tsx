import { render, screen } from '@testing-library/react';
import EventsPage from '../EventsPage';

describe('EventsPage', () => {
  it('renders header', () => {
    render(<EventsPage />);
    expect(screen.getByRole('banner')).toBeVisible();
  });
});
