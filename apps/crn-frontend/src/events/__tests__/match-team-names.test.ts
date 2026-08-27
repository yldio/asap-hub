import { createTeamListItemResponse } from '@asap-hub/fixtures';
import { TeamListItemResponse } from '@asap-hub/model';
import { EventAttendanceTeam } from '@asap-hub/react-components';

import { matchTeamNames, normalizeTeamName } from '../match-team-names';

const team = (
  overrides: Partial<TeamListItemResponse> = {},
): TeamListItemResponse => ({
  ...createTeamListItemResponse(),
  id: 't-alessi',
  displayName: 'Alessi',
  teamType: 'Discovery Team',
  ...overrides,
});

const attendanceRow = (teamId: string): EventAttendanceTeam => ({
  teamId,
  teamName: teamId,
  attended: true,
});

describe('normalizeTeamName', () => {
  it.each`
    input             | expected
    ${'  Alessi  '}   | ${'alessi'}
    ${'ALESSI'}       | ${'alessi'}
    ${'Team Alessi'}  | ${'alessi'}
    ${'team  alessi'} | ${'alessi'}
    ${'Alessi Team'}  | ${'alessi team'}
    ${'Teamwork'}     | ${'teamwork'}
  `('Should normalize $input to $expected', ({ input, expected }) => {
    expect(normalizeTeamName(input)).toEqual(expected);
  });
});

describe('matchTeamNames', () => {
  it('Should match a name exactly', () => {
    const result = matchTeamNames(['Alessi'], [team()], []);

    expect(result.matched).toEqual([
      {
        teamId: 't-alessi',
        teamName: 'Alessi',
        attended: true,
        teamType: 'Discovery Team',
        isTeamInactive: false,
      },
    ]);
    expect(result.unmatched).toEqual([]);
    expect(result.alreadyInCount).toEqual(0);
  });

  it.each(['Team Alessi', 'ALESSI', '  alessi  '])(
    'Should match %s against the stored display name',
    (name) => {
      const result = matchTeamNames([name], [team()], []);

      expect(result.matched).toHaveLength(1);
      expect(result.unmatched).toEqual([]);
    },
  );

  it('Should list a name with no match, without a suggestion', () => {
    const result = matchTeamNames([' Alessy '], [team()], []);

    expect(result.matched).toEqual([]);
    expect(result.unmatched).toEqual([{ name: 'Alessy' }]);
    expect(result.unmatched[0]?.suggestion).toBeUndefined();
  });

  it('Should count an already added team instead of matching it', () => {
    const result = matchTeamNames(
      ['Alessi'],
      [team()],
      [attendanceRow('t-alessi')],
    );

    expect(result.matched).toEqual([]);
    expect(result.alreadyInCount).toEqual(1);
    expect(result.unmatched).toEqual([]);
  });

  it('Should keep the three sets disjoint so the summary total adds up', () => {
    const teams = [
      team(),
      team({ id: 't-aguzzi', displayName: 'Aguzzi' }),
      team({ id: 't-chen', displayName: 'Chen' }),
    ];

    const result = matchTeamNames(
      ['Alessi', 'Aguzzi', 'Chen', 'Nobody'],
      teams,
      [attendanceRow('t-chen')],
    );

    expect(result.matched.map(({ teamName }) => teamName)).toEqual([
      'Alessi',
      'Aguzzi',
    ]);
    expect(result.alreadyInCount).toEqual(1);
    expect(result.unmatched).toEqual([{ name: 'Nobody' }]);
    expect(
      result.matched.length + result.alreadyInCount + result.unmatched.length,
    ).toEqual(4);
  });

  it('Should count a repeated name once', () => {
    const result = matchTeamNames(
      ['Alessi', 'Team Alessi', 'ALESSI', 'Ghost', 'ghost'],
      [team()],
      [],
    );

    expect(result.matched).toHaveLength(1);
    expect(result.unmatched).toEqual([{ name: 'Ghost' }]);
  });

  it('Should skip blank names', () => {
    const result = matchTeamNames(['   ', ''], [team()], []);

    expect(result).toEqual({ matched: [], alreadyInCount: 0, unmatched: [] });
  });

  it('Should match an inactive team and flag it', () => {
    const result = matchTeamNames(
      ['Alessi'],
      [team({ inactiveSince: '2024-01-01T00:00:00.000Z' })],
      [],
    );

    expect(result.matched[0]?.isTeamInactive).toEqual(true);
  });
});
