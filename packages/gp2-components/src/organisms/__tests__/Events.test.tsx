import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Events from '../Events';

it('renders the subscribe button', async () => {
  render(<Events calendarId="12w3" paragraph={'paragraph'} />);

  const subscribe = screen.getByRole('button', {
    name: /subscribe to calendar/i,
  });
  expect(subscribe).toBeVisible();
  await userEvent.click(subscribe);
  expect(
    screen.getByRole('link', { name: /Add to Google Calendar/i }),
  ).toBeVisible();
});

it('renders the paragraph', async () => {
  const paragraph = 'this is the paragraph';
  render(<Events calendarId="12w3" paragraph={paragraph} />);

  const subscribe = screen.getByRole('button', {
    name: /subscribe to calendar/i,
  });
  expect(subscribe).toBeVisible();
  await userEvent.click(subscribe);
  expect(screen.getByText(paragraph)).toBeVisible();
});
