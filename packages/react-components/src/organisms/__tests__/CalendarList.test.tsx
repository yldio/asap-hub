import { ComponentProps } from 'react';
import { fireEvent, render } from '@testing-library/react';
import { createListCalendarResponse } from '@asap-hub/fixtures';

import CalendarList from '../CalendarList';

const props: ComponentProps<typeof CalendarList> = {
  calendars: [],
  page: 'calendar',
};
it('Renders calender list', () => {
  const { getByRole } = render(<CalendarList {...props} />);
  expect(getByRole('heading').textContent).toMatch(/subscribe/i);
});

it('Renders calender list item with colour', () => {
  const { getByText } = render(
    <CalendarList
      {...props}
      calendars={[
        {
          color: '#0D7813',
          name: 'Test Event',
          id: '1',
        },
      ]}
    />,
  );
  expect(getComputedStyle(getByText('●')).color).toMatch('rgb(13, 120, 19)');
  expect(getByText('Test Event')).toBeVisible();
});

it('Correctly generates the subscribe link', () => {
  const { getAllByRole } = render(
    <CalendarList
      {...props}
      calendars={[
        {
          color: '#113F47',
          name: 'Test Event',
          id: '1',
        },
      ]}
    />,
  );

  const links = getAllByRole('link').map((e) => e.getAttribute('href'));
  expect(links).toMatchInlineSnapshot(`
    Array [
      "https://support.apple.com/en-us/guide/calendar/icl1022/mac",
      "https://support.microsoft.com/en-us/office/import-or-subscribe-to-a-calendar-in-outlook-com-cff1429c-5af6-41ec-a5b4-74f2c278e98c",
    ]
  `);
});

it('adapts for interest group page', () => {
  const { getByRole } = render(<CalendarList {...props} page="group" />);
  expect(getByRole('heading')).toHaveTextContent(/this interest group/i);
});

it('adapts the headline for event page', () => {
  const { getByRole } = render(<CalendarList {...props} page="event" />);
  expect(getByRole('heading')).toHaveTextContent(/this event/i);
});

it('adapts the headline and adds a description for calendar page', () => {
  const { getByText } = render(<CalendarList {...props} page="calendar" />);
  expect(getByText(/interest groups on/i)).toBeVisible();
  expect(getByText(/list of.+groups/i)).toBeVisible();
});

it('adapts the headline and adds a description for calendar working group page', () => {
  const { getByText } = render(
    <CalendarList {...props} page="calendar-working-group" />,
  );
  expect(getByText(/working groups on/i)).toBeVisible();
  expect(getByText(/list of.+groups/i)).toBeVisible();
});

it('displays the show more button', () => {
  const { getByText, queryByText, getByRole } = render(
    <CalendarList
      {...props}
      page="calendar-working-group"
      calendars={createListCalendarResponse(6).items.concat({
        color: '#113F47',
        name: 'last Event',
        id: '1',
      })}
    />,
  );
  const button = getByRole('button', { name: 'View More' });

  expect(button).toBeVisible();
  expect(queryByText('last Event')).not.toBeInTheDocument();
  fireEvent.click(button);
  expect(getByRole('button', { name: 'View Less' })).toBeVisible();
  expect(getByText('last Event')).toBeInTheDocument();
});
