import { getEventFilters } from '../src/filters';
describe('Filters', () => {
  test('before date is set', () => {
    expect(getEventFilters({ before: '2021-12-28' })).toEqual(
      'endDateTimestamp < 1640649600',
    );
  });
  test('after date is set', () => {
    expect(getEventFilters({ after: '2021-12-28' })).toEqual(
      'endDateTimestamp > 1640649600',
    );
  });
  test('before and after date is set', () => {
    expect(
      getEventFilters({ before: '2007-07-06', after: '2021-12-28' }),
    ).toEqual('endDateTimestamp < 1183680000 OR endDateTimestamp > 1640649600');
  });
  test('dates constained by user', () => {
    expect(
      getEventFilters(
        { before: '2007-07-06', after: '2021-12-28' },
        { userId: '1103' },
      ),
    ).toEqual(
      '(endDateTimestamp < 1183680000 OR endDateTimestamp > 1640649600) AND speakers.user.id: "1103"',
    );
  });
  test('only userId is passed', () => {
    expect(getEventFilters({}, { userId: '1103' })).toEqual(
      'speakers.user.id: "1103"',
    );
  });
  test('dates constained by team', () => {
    expect(
      getEventFilters(
        { before: '2007-07-06', after: '2021-12-28' },
        { teamId: '1103' },
      ),
    ).toEqual(
      '(endDateTimestamp < 1183680000 OR endDateTimestamp > 1640649600) AND speakers.team.id: "1103"',
    );
  });
  test('only teamId is passed', () => {
    expect(getEventFilters({}, { teamId: '1103' })).toEqual(
      'speakers.team.id: "1103"',
    );
  });
  test('throws when both userId and teamId are passed', () => {
    expect(() =>
      getEventFilters({}, { userId: '1103', teamId: '1103' }),
    ).toThrowError(/userId and teamId not supported/i);
  });
});
