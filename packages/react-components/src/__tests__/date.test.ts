import { act, renderHook } from '@testing-library/react';
import { addSeconds, subSeconds } from 'date-fns';
import {
  formatDateToTimezone,
  useDateHasPassed,
  formatDateAndWeekday,
} from '../date';
import { getLocalTimezone } from '../localization';

jest.useFakeTimers();

jest.mock('../localization');
const mockGetLocalTimezone = getLocalTimezone as jest.MockedFunction<
  typeof getLocalTimezone
>;

// Store interval callbacks for manual triggering in tests
let intervalCallback: (() => void) | null = null;

jest.mock('../hooks', () => ({
  ...jest.requireActual('../hooks'),
  useInterval: (callback: () => void, delay: number | null) => {
    // Store the callback so tests can manually trigger it
    intervalCallback = delay !== null ? callback : null;
  },
}));

beforeEach(() => {
  mockGetLocalTimezone.mockReturnValue('UTC');
  intervalCallback = null;
});

afterEach(() => {
  jest.clearAllTimers();
});

describe('formatDateAndWeekday', () => {
  it('returns day of the week and date', () => {
    expect(formatDateAndWeekday(new Date('2024-10-01'))).toEqual(
      'Tue, 1st October 2024',
    );
  });
});

describe('formatDateToTimezone', () => {
  const FORMAT = 'yyyy-MM-dd HH:mm:ss XXX';
  it('converts UTC to non-UTC', () => {
    mockGetLocalTimezone.mockReturnValue('Europe/Tallinn');
    const date = '2014-01-25T10:46:20Z';
    expect(formatDateToTimezone(date, FORMAT)).toMatchInlineSnapshot(
      `"2014-01-25 12:46:20 +02:00"`,
    );
  });
  it('converts non-UTC to non-UTC', () => {
    const date = '2014-01-25T12:46:20+02:00';
    mockGetLocalTimezone.mockReturnValue('Europe/Tallinn');
    expect(formatDateToTimezone(date, FORMAT)).toMatchInlineSnapshot(
      `"2014-01-25 12:46:20 +02:00"`,
    );
  });
  it('accepts a target timezone override', () => {
    const date = '2014-01-25T10:46:20Z';
    expect(
      formatDateToTimezone(date, FORMAT, 'Europe/Berlin'),
    ).toMatchInlineSnapshot(`"2014-01-25 11:46:20 +01:00"`);
  });
});

describe('useDateHasPassed', () => {
  it('returns false before given date', () => {
    const { result } = renderHook(() =>
      useDateHasPassed(addSeconds(new Date(), 5)),
    );
    expect(result.current).toBe(false);
  });

  it('returns true after given date', () => {
    const { result } = renderHook(() =>
      useDateHasPassed(subSeconds(new Date(), 5)),
    );
    expect(result.current).toBe(true);
  });

  it('changes to true when given date elapses', () => {
    // Set a fixed initial time
    const startTime = new Date('2024-01-01T12:00:00Z');
    jest.setSystemTime(startTime);

    // The target date is 5 seconds in the future
    const targetDate = addSeconds(startTime, 5);

    const { result } = renderHook(() => useDateHasPassed(targetDate));

    // Initially should be false (target is in the future)
    expect(result.current).toBe(false);

    // Simulate time passing - update the system time and trigger the interval callback
    act(() => {
      jest.setSystemTime(addSeconds(startTime, 15));
      // Manually trigger the interval callback (mocked useInterval stores it)
      if (intervalCallback) {
        intervalCallback();
      }
    });

    expect(result.current).toBe(true);
  });
});
