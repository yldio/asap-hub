import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import EventTime from '../EventTime';
import { getLocalTimezone } from '../../localization';

jest.mock('../../localization');

const mockGetLocalTimezone = getLocalTimezone as jest.MockedFunction<
  typeof getLocalTimezone
>;
beforeEach(() => {
  mockGetLocalTimezone.mockReturnValue('UTC');
});

it("the time is shown in the user's local timezone", () => {
  mockGetLocalTimezone.mockReturnValue('America/New_York');
  const { container } = render(
    <EventTime
      startDate={new Date('2021-01-25T15:00:00Z').toISOString()}
      startDateTimeZone="UTC"
      endDate={new Date('2021-01-25T16:00:00Z').toISOString()}
      endDateTimeZone="UTC"
    />,
  );
  expect(container).toHaveTextContent(/\D10:00\D.*\D11:00\D.*EST/);
});

describe('the date', () => {
  it('is shown only once if start and end date are the same', () => {
    const { container } = render(
      <EventTime
        startDate={new Date('2021-01-25T00:00:00Z').toISOString()}
        startDateTimeZone="UTC"
        endDate={new Date('2021-01-25T10:00:00Z').toISOString()}
        endDateTimeZone="UTC"
      />,
    );
    expect(container).toHaveTextContent(/\D25\D/);
    expect(container).not.toHaveTextContent(/\D25\D.*\D25\D/);
  });

  it('is shown for start and end day for a multi-day event', () => {
    mockGetLocalTimezone.mockReturnValue('America/New_York');
    const { container } = render(
      <EventTime
        startDate={new Date('2021-01-26T00:00:00Z').toISOString()}
        startDateTimeZone="UTC"
        endDate={new Date('2021-01-26T10:00:00Z').toISOString()}
        endDateTimeZone="UTC"
      />,
    );
    expect(container).toHaveTextContent(/\D25\D.*\D26\D/);
  });
});

describe('a tooltip', () => {
  it('is shown mentioning the original timezone once if the same for start and end date', () => {
    const { getByTitle, getByRole } = render(
      <EventTime
        startDate={new Date('2021-01-26T09:00:00Z').toISOString()}
        startDateTimeZone="Europe/Berlin"
        endDate={new Date('2021-01-26T10:00:00Z').toISOString()}
        endDateTimeZone="Europe/Berlin"
      />,
    );
    await userEvent.click(getByTitle(/info/i));
    expect(getByRole('tooltip')).toHaveTextContent(
      /\D10:00\D.*\D11:00\D.*GMT\+1\D/,
    );
    expect(getByRole('tooltip')).not.toHaveTextContent(/GMT\+1\D.*GMT\+1\D/);
  });

  it('is shown mentioning the original start and end timezones', () => {
    const { getByTitle, getByRole } = render(
      <EventTime
        startDate={new Date('2021-01-26T09:00:00Z').toISOString()}
        startDateTimeZone="Europe/Berlin"
        endDate={new Date('2021-01-26T10:00:00Z').toISOString()}
        endDateTimeZone="Europe/Tallinn"
      />,
    );
    await userEvent.click(getByTitle(/info/i));
    expect(getByRole('tooltip')).toHaveTextContent(
      /\D10:00\D.*GMT\+1\D.*\D12:00\D.*GMT\+2\D/,
    );
  });
});
