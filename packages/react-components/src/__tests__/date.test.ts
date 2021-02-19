import { formatDateToLocalTimezone } from '../date';
import { getLocalTimezone } from '../localization';

jest.mock('../localization');

const mockedGetLocalTimezone = getLocalTimezone as jest.MockedFunction<
  typeof getLocalTimezone
>;

describe('formatTimezoneToLocalTimezone', () => {
  const FORMAT = 'yyyy-MM-dd HH:mm:ss XXX';
  it('converts UTC to non-UTC', () => {
    mockedGetLocalTimezone.mockReturnValue('Europe/Tallinn');
    const date = '2014-06-25T10:46:20Z';
    expect(formatDateToLocalTimezone(date, FORMAT)).toMatchInlineSnapshot(
      `"2014-06-25 13:46:20 +03:00"`,
    );
  });
  it('converts non-UTC to non-UTC', () => {
    const date = '2014-06-25T12:46:20+02:00';
    mockedGetLocalTimezone.mockReturnValue('Europe/Tallinn');
    expect(formatDateToLocalTimezone(date, FORMAT)).toMatchInlineSnapshot(
      `"2014-06-25 13:46:20 +03:00"`,
    );
  });
});
