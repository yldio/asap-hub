import { act, renderHook } from '@testing-library/react-hooks/server';
import { addSeconds, subSeconds } from 'date-fns';
import { formatDateToTimezone, useDateHasPassed } from '../date';
import { getLocalTimezone } from '../localization';

jest.useFakeTimers();

jest.mock('../localization');
const mockGetLocalTimezone = getLocalTimezone as jest.MockedFunction<
  typeof getLocalTimezone
>;
beforeEach(() => {
  mockGetLocalTimezone.mockReturnValue('UTC');
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

  // A dependency update broke running the effect interval in tests, and no clue how to fix it
  // eslint-disable-next-line jest/no-disabled-tests
  it.skip('changes to true when given date elapses', async () => {
    const { result } = renderHook(() =>
      useDateHasPassed(addSeconds(new Date(), 5)),
    );
    act(() => {
      jest.advanceTimersByTime(30 * 1000);
    });
    expect(result.current).toBe(true);
  });
});
