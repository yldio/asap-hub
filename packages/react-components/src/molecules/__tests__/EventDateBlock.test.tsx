import { render, screen } from '@testing-library/react';

import EventDateBlock from '../EventDateBlock';
import { getLocalTimezone } from '../../localization';

jest.mock('../../localization');

const mockGetLocalTimezone = getLocalTimezone as jest.MockedFunction<
  typeof getLocalTimezone
>;
beforeEach(() => {
  mockGetLocalTimezone.mockReturnValue('UTC');
});

it('shows the abbreviated month and the day of the start date', () => {
  render(
    <EventDateBlock
      startDate={new Date('2021-05-28T10:00:00Z').toISOString()}
    />,
  );
  expect(screen.getByText('MAY')).toBeVisible();
  expect(screen.getByText('28')).toBeVisible();
});

it("shows the date in the user's local timezone", () => {
  mockGetLocalTimezone.mockReturnValue('Pacific/Auckland');
  render(
    <EventDateBlock
      startDate={new Date('2021-05-31T23:00:00Z').toISOString()}
    />,
  );
  expect(screen.getByText('JUN')).toBeVisible();
  expect(screen.getByText('1')).toBeVisible();
});
