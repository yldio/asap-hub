import { render, screen } from '@testing-library/react';
import EventsPage from '../EventsPage';

describe('EventsPage', () => {
  it('renders header', () => {
    render(<EventsPage />);
    expect(screen.getByRole('banner')).toBeVisible();
  });
  it('renders Events tabs when enabled', () => {
    render(<EventsPage />);
    expect(screen.getByRole('link', { name: /upcoming/i })).toBeVisible();
    expect(screen.getByRole('link', { name: /past/i })).toBeVisible();
  });
});
