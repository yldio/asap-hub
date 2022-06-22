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
      '(endDateTimestamp < 1183680000 OR endDateTimestamp > 1640649600) AND (speakers.user.id: "1103")',
    );
  });
  test('only userId is passed', () => {
    expect(getEventFilters({}, { userId: '1103' })).toEqual(
      'speakers.user.id: "1103"',
    );
  });
  test('dates constained by group', () => {
    expect(
      getEventFilters(
        { before: '2007-07-06', after: '2021-12-28' },
        { groupId: '1234' },
      ),
    ).toEqual(
      '(endDateTimestamp < 1183680000 OR endDateTimestamp > 1640649600) AND (group.id: "1234")',
    );
  });
  test('only groupId is passed', () => {
    expect(getEventFilters({}, { groupId: '1234' })).toEqual(
      'group.id: "1234"',
    );
  });
  test('groupId and userId is passed', () => {
    expect(getEventFilters({}, { userId: '4321', groupId: '1234' })).toEqual(
      'speakers.user.id: "4321" AND group.id: "1234"',
    );
  });
  test('dates constained by user and group', () => {
    expect(
      getEventFilters(
        { before: '2007-07-06', after: '2021-12-28' },
        { userId: '1103', groupId: '4321' },
      ),
    ).toEqual(
      '(endDateTimestamp < 1183680000 OR endDateTimestamp > 1640649600) AND (speakers.user.id: "1103" AND group.id: "4321")',
    );
  });
});
