import { fireEvent, render, screen } from '@testing-library/react';
import { createListCalendarResponse } from '@asap-hub/fixtures';

import CalendarHubUpdates from '../CalendarHubUpdates';

it('renders nothing when there are no calendars', () => {
  const { container } = render(<CalendarHubUpdates calendars={[]} />);
  expect(container).toBeEmptyDOMElement();
});

it('renders the title, the description and a subscribe button for a single calendar', () => {
  render(
    <CalendarHubUpdates
      calendars={[
        { id: 'hub@asap.science', name: 'ASAP Hub', color: '#B1365F' },
      ]}
    />,
  );

  expect(
    screen.getByRole('heading', { name: 'CRN Hub Updates' }),
  ).toBeVisible();
  expect(
    screen.getByText(/Subscribe to the official CRN calendar/i),
  ).toBeVisible();
  expect(screen.queryByText('ASAP Hub')).not.toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: /subscribe/i }));
  expect(
    screen.getByRole('link', { name: /Add to Google Calendar/i }),
  ).toHaveAttribute(
    'href',
    'https://calendar.google.com/calendar/r?cid=hub%40asap.science',
  );
});

it('lists each calendar with its own subscribe button when there are several', () => {
  const calendars = createListCalendarResponse(2).items;
  render(<CalendarHubUpdates calendars={calendars} />);

  expect(screen.getByText('Calendar 0')).toBeVisible();
  expect(screen.getByText('Calendar 1')).toBeVisible();
  expect(screen.getAllByRole('button', { name: /subscribe/i })).toHaveLength(2);
});
