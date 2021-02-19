import { formatDateToLocalTimezone } from '../date';
import { getLocalTimezone } from '../localization';

jest.mock('../localization');

const mockedGetLocalTimezone = getLocalTimezone as jest.MockedFunction<
  typeof getLocalTimezone
>;

describe('formatTimezoneToLocalTimezone', () => {
  const FORMAT = 'yyyy-MM-dd HH:mm:ssXXX';
  it('converts UTC to Europe/Paris', () => {
    mockedGetLocalTimezone.mockReturnValue('Europe/Paris');
    const date = '2014-06-25T10:46:20Z';
    expect(formatDateToLocalTimezone(date, FORMAT)).toMatchInlineSnapshot(
      `"2014-06-25 12:46:20+02:00"`,
    );
  });
  it('defaults to UTC when timezone not provided', () => {
    mockedGetLocalTimezone.mockReturnValue('Europe/Paris');
    const date = '2014-06-25T10:46:20';
    expect(formatDateToLocalTimezone(date, FORMAT)).toMatchInlineSnapshot(
      `"2014-06-25 12:46:20+02:00"`,
    );
  });
  it('converts non-UTC date', () => {
    const date = '2014-06-25T10:46:20+02:00';
    mockedGetLocalTimezone.mockReturnValue('Europe/London');
    expect(formatDateToLocalTimezone(date, FORMAT)).toMatchInlineSnapshot(
      `"2014-06-25 09:46:20+01:00"`,
    );
  });
});
