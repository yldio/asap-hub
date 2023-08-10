import { useFlags } from '@asap-hub/react-context';
import { render, screen } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import EventsPage from '../EventsPage';

describe('EventsPage', () => {
  it('renders header', () => {
    render(<EventsPage />);
    expect(screen.getByRole('banner')).toBeVisible();
  });
  it('renders Events tabs when enabled', () => {
    const {
      result: { current },
    } = renderHook(useFlags);
    current.enable('DISPLAY_EVENTS');
    render(<EventsPage />);
    expect(screen.getByRole('link', { name: /upcoming/i })).toBeVisible();
    expect(screen.getByRole('link', { name: /past/i })).toBeVisible();
  });
});
