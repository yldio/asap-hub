import { render } from '@testing-library/react';
import { createCalendarResponse } from '@asap-hub/fixtures';

import GroupProfileCalendar from '../GroupProfileCalendar';

it('renders a calendar list if there is at least one calendar', () => {
  const { getByText } = render(
    <GroupProfileCalendar
      calendars={[{ ...createCalendarResponse(), name: 'MyCal' }]}
      groupType="interest"
    />,
  );
  expect(getByText(/subscribe.+calendar/i)).toBeVisible();
  expect(getByText('MyCal')).toBeVisible();
});
it('does not render calendar list if there is at least one calendar', () => {
  const { queryByText } = render(
    <GroupProfileCalendar calendars={[]} groupType="interest" />,
  );
  expect(queryByText(/subscribe.+calendar/i)).not.toBeInTheDocument();
});
