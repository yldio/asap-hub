import { ComponentProps } from 'react';
import { render } from '@testing-library/react';

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
    [
      "https://support.apple.com/en-us/guide/calendar/icl1022/mac",
      "https://support.microsoft.com/en-us/office/import-or-subscribe-to-a-calendar-in-outlook-com-cff1429c-5af6-41ec-a5b4-74f2c278e98c",
    ]
  `);
});

it('adapts for group page', () => {
  const { getByRole } = render(<CalendarList {...props} page="group" />);
  expect(getByRole('heading')).toHaveTextContent(/this group/i);
});

it('adapts the headline for event page', () => {
  const { getByRole } = render(<CalendarList {...props} page="event" />);
  expect(getByRole('heading')).toHaveTextContent(/this event/i);
});

it('adapts the headline and adds a description for calendar page', () => {
  const { getByText } = render(<CalendarList {...props} page="calendar" />);
  expect(getByText(/groups on/i)).toBeVisible();
  expect(getByText(/list of.+groups/i)).toBeVisible();
});
