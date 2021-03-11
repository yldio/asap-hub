import { formatDateToTimezone } from '../date';
import { getLocalTimezone } from '../localization';

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
