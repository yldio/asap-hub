import { useFlags } from '@asap-hub/react-context';
import { render, screen } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import EventsPage from '../EventsPage';

describe('EventsPage', () => {
  it('renders header', () => {
    render(<EventsPage />);
    expect(screen.getByRole('banner')).toBeVisible();
  });
  it('renders Upcoming Events when enabled', () => {
    const {
      result: { current },
    } = renderHook(useFlags);
    current.enable('ASAP_UPCOMING_EVENTS');
    render(<EventsPage />);
    expect(screen.getByRole('link', { name: /upcoming/i })).toBeVisible();
  });
  it('renders Past Events when enabled', () => {
    const {
      result: { current },
    } = renderHook(useFlags);
    current.enable('ASAP_PAST_EVENTS');
    render(<EventsPage />);
    expect(screen.getByRole('link', { name: /past/i })).toBeVisible();
  });
});
