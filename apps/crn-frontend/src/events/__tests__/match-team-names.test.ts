import { createTeamListItemResponse } from '@asap-hub/fixtures';
import { TeamListItemResponse } from '@asap-hub/model';
import { EventAttendanceTeam } from '@asap-hub/react-components';

import { matchTeamNames, normalizeTeamName } from '../match-team-names';
import { ParsedTeamRow } from '../parse-team-list';

const team = (
  overrides: Partial<TeamListItemResponse> = {},
): TeamListItemResponse => ({
  ...createTeamListItemResponse(),
  id: 't-alessi',
  displayName: 'Alessi',
  teamType: 'Discovery Team',
  ...overrides,
});

const row = (name: string, attended = false): ParsedTeamRow => ({
  name,
  attended,
});

const attendanceRow = (
  teamId: string,
  attended = true,
): EventAttendanceTeam => ({
  teamId,
  teamName: teamId,
  attended,
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
  it('Should match a name and carry its uploaded attendance status', () => {
    const result = matchTeamNames([row('Alessi', true)], [team()], []);

    expect(result.matched).toEqual([
      {
        teamId: 't-alessi',
        teamName: 'Alessi',
        attended: true,
        teamType: 'Discovery Team',
        isTeamInactive: false,
      },
    ]);
    expect(result.alreadyIn).toEqual([]);
    expect(result.unmatched).toEqual([]);
  });

  it('Should match a name marked not attended', () => {
    const result = matchTeamNames([row('Alessi', false)], [team()], []);

    expect(result.matched[0]?.attended).toEqual(false);
  });

  it.each(['Team Alessi', 'ALESSI', '  alessi  '])(
    'Should match %s against the stored display name',
    (name) => {
      const result = matchTeamNames([row(name)], [team()], []);

      expect(result.matched).toHaveLength(1);
      expect(result.unmatched).toEqual([]);
    },
  );

  it('Should list a name with no match, without a suggestion', () => {
    const result = matchTeamNames([row(' Alessy ')], [team()], []);

    expect(result.matched).toEqual([]);
    expect(result.unmatched).toEqual([{ name: 'Alessy' }]);
    expect(result.unmatched[0]?.suggestion).toBeUndefined();
  });

  it('Should put an already-listed team into alreadyIn with the uploaded status', () => {
    const result = matchTeamNames(
      [row('Alessi', false)],
      [team()],
      [attendanceRow('t-alessi', true)],
    );

    expect(result.matched).toEqual([]);
    expect(result.alreadyIn).toEqual([
      {
        teamId: 't-alessi',
        teamName: 'Alessi',
        attended: false,
        teamType: 'Discovery Team',
        isTeamInactive: false,
      },
    ]);
    expect(result.unmatched).toEqual([]);
  });

  it('Should keep the three sets disjoint so the summary total adds up', () => {
    const teams = [
      team(),
      team({ id: 't-aguzzi', displayName: 'Aguzzi' }),
      team({ id: 't-chen', displayName: 'Chen' }),
    ];

    const result = matchTeamNames(
      [row('Alessi', true), row('Aguzzi'), row('Chen', true), row('Nobody')],
      teams,
      [attendanceRow('t-chen')],
    );

    expect(result.matched.map(({ teamName }) => teamName)).toEqual([
      'Alessi',
      'Aguzzi',
    ]);
    expect(result.alreadyIn.map(({ teamName }) => teamName)).toEqual(['Chen']);
    expect(result.unmatched).toEqual([{ name: 'Nobody' }]);
    expect(
      result.matched.length +
        result.alreadyIn.length +
        result.unmatched.length,
    ).toEqual(4);
  });

  it('Should keep the first occurrence of a repeated name', () => {
    const result = matchTeamNames(
      [row('Alessi', true), row('Team Alessi', false), row('Ghost'), row('ghost')],
      [team()],
      [],
    );

    expect(result.matched).toHaveLength(1);
    expect(result.matched[0]?.attended).toEqual(true);
    expect(result.unmatched).toEqual([{ name: 'Ghost' }]);
  });

  it('Should skip blank names', () => {
    const result = matchTeamNames([row('   '), row('')], [team()], []);

    expect(result).toEqual({ matched: [], alreadyIn: [], unmatched: [] });
  });

  it('Should match an inactive team and flag it', () => {
    const result = matchTeamNames(
      [row('Alessi')],
      [team({ inactiveSince: '2024-01-01T00:00:00.000Z' })],
      [],
    );

    expect(result.matched[0]?.isTeamInactive).toEqual(true);
  });
});
