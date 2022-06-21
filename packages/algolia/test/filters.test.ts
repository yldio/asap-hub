import { getEventFilters } from '../src/filters';
describe('Filters', () => {
  test('before date is set', () => {
    expect(getEventFilters('2021-12-28', undefined)).toEqual(
      'endDateTimestamp < 1640649600',
    );
  });
  test('after date is set', () => {
    expect(getEventFilters(undefined, '2021-12-28')).toEqual(
      'endDateTimestamp > 1640649600',
    );
  });
  test('before and after date is set', () => {
    expect(getEventFilters('2007-07-06', '2021-12-28')).toEqual(
      'endDateTimestamp < 1183680000 OR endDateTimestamp > 1640649600',
    );
  });
  test('dates constained by user', () => {
    expect(
      getEventFilters('2007-07-06', '2021-12-28', { userId: '1103' }),
    ).toEqual(
      '(endDateTimestamp < 1183680000 OR endDateTimestamp > 1640649600) AND speakers.user.id: "1103"',
    );
  });
  test('only userId is passed', () => {
    expect(getEventFilters(undefined, undefined, { userId: '1103' })).toEqual(
      'speakers.user.id: "1103"',
    );
  });
});
