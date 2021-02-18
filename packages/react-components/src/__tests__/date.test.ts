import { formatTimezoneToLocalTimezone } from '../date';
import { getLocalTimezone } from '../localization';

jest.mock('../localization');

const mockedGetLocalTimezone = getLocalTimezone as jest.MockedFunction<
  typeof getLocalTimezone
>;

describe('formatTimezoneToLocalTimezone', () => {
  const FORMAT = 'yyyy-MM-dd HH:mm:ssXXX';
  it('Converts UTC to Europe/Paris', () => {
    mockedGetLocalTimezone.mockReturnValue('Europe/Paris');
    const date = '2014-06-25T10:46:20Z';
    expect(formatTimezoneToLocalTimezone(date, FORMAT)).toMatchInlineSnapshot(
      `"2014-06-25 10:46:20+02:00"`,
    );
  });
  it('defaults to UTC when timezone not provided', () => {
    mockedGetLocalTimezone.mockReturnValue('Europe/Paris');
    const date = '2014-06-25T10:46:20';
    expect(formatTimezoneToLocalTimezone(date, FORMAT)).toMatchInlineSnapshot(
      `"2014-06-25 10:46:20+02:00"`,
    );
  });
  it('converts CEST to UTC', () => {
    const date = '2014-06-25T10:46:20+02:00';
    mockedGetLocalTimezone.mockReturnValue('Etc/UTC');
    expect(formatTimezoneToLocalTimezone(date, FORMAT)).toMatchInlineSnapshot(
      `"2014-06-25 08:46:20Z"`,
    );
  });
});
