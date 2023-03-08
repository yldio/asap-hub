import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Events from '../Events';

it('renders the subscribe button', () => {
  render(<Events calendarId="12w3" />);

  const subscribe = screen.getByRole('button', {
    name: /subscribe to calendar/i,
  });
  expect(subscribe).toBeVisible();
  userEvent.click(subscribe);
  expect(
    screen.getByRole('link', { name: /Add to Google Calendar/i }),
  ).toBeVisible();
});
