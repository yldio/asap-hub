import { ComponentProps } from 'react';
import { fireEvent, render } from '@testing-library/react';
import { createListCalendarResponse } from '@asap-hub/fixtures';

import CalendarList from '../CalendarList';

const props: ComponentProps<typeof CalendarList> = {
  calendars: [],
  title: '',
};

it('Renders calender list', () => {
  const { getByRole } = render(
    <CalendarList
      {...props}
      title="Subscribe to this Interest Groups Calendar"
    />,
  );
  expect(getByRole('heading').textContent).toMatch(/subscribe/i);
});

it('Renders calender list item with colour', () => {
  const { getByText } = render(
    <CalendarList
      {...props}
      calendars={[
        {
          color: '#0D7813',
          name: 'Test Calendar',
          id: '1',
          groups: [],
          workingGroups: [],
        },
      ]}
    />,
  );
  expect(getComputedStyle(getByText('●')).color).toMatch('rgb(13, 120, 19)');
  expect(getByText('Test Calendar')).toBeVisible();
});

it('Correctly generates the subscribe link', () => {
  const { getAllByRole } = render(
    <CalendarList
      {...props}
      calendars={[
        {
          color: '#113F47',
          name: 'Test Calendar',
          id: '1',
          groups: [],
          workingGroups: [],
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

it('displays the show more button', () => {
  const { getByText, queryByText, getByRole } = render(
    <CalendarList
      {...props}
      calendars={createListCalendarResponse(6).items.concat({
        color: '#113F47',
        name: 'last Calendar',
        id: '1',
        groups: [],
        workingGroups: [],
      })}
    />,
  );
  const button = getByRole('button', { name: 'View More' });

  expect(button).toBeVisible();
  expect(queryByText('last Calendar')).not.toBeInTheDocument();
  fireEvent.click(button);
  expect(getByRole('button', { name: 'View Less' })).toBeVisible();
  expect(getByText('last Calendar')).toBeInTheDocument();
});

it('displays the description', () => {
  const { getByText } = render(
    <CalendarList {...props} description={'Test Description'} />,
  );
  expect(getByText('Test Description')).toBeVisible();
});
