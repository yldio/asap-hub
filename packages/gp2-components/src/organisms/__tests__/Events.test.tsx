import { render, screen } from '@testing-library/react';
import { ComponentProps } from 'react';
import userEvent from '@testing-library/user-event';
import Events from '../Events';

const props: ComponentProps<typeof Events> = {
  calendarId: '42',
};

it('renders events header', () => {
  render(<Events {...props} />);
  expect(screen.getByRole('heading', { name: /Events/i })).toBeVisible();
});

it('renders the subscribe button', () => {
  render(<Events {...props} calendarId="12w3" />);

  const subscribe = screen.getByRole('button', {
    name: /subscribe to calendar/i,
  });
  expect(subscribe).toBeVisible();
  userEvent.click(subscribe);
  expect(
    screen.getByRole('link', { name: /Add to Google Calendar/i }),
  ).toBeVisible();
});
