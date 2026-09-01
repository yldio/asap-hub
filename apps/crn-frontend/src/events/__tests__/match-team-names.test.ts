import { createTeamListItemResponse } from '@asap-hub/fixtures';
import { TeamListItemResponse } from '@asap-hub/model';

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
    const result = matchTeamNames([row('Alessi', true)], [team()]);

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
  });

  it('Should match a name marked not attended', () => {
    const result = matchTeamNames([row('Alessi', false)], [team()]);

    expect(result.matched[0]?.attended).toEqual(false);
  });

  it.each(['Team Alessi', 'ALESSI', '  alessi  '])(
    'Should match %s against the stored display name',
    (name) => {
      const result = matchTeamNames([row(name)], [team()]);

      expect(result.matched).toHaveLength(1);
      expect(result.unmatched).toEqual([]);
    },
  );

  it('Should list a name with no match, without a suggestion', () => {
    const result = matchTeamNames([row(' Alessy ')], [team()]);

    expect(result.matched).toEqual([]);
    expect(result.unmatched).toEqual([{ name: 'Alessy' }]);
    expect(result.unmatched[0]?.suggestion).toBeUndefined();
  });

  it('Should resolve every Hub team into matched regardless of the current table', () => {
    const teams = [
      team(),
      team({ id: 't-aguzzi', displayName: 'Aguzzi' }),
      team({ id: 't-chen', displayName: 'Chen' }),
    ];

    const result = matchTeamNames(
      [row('Alessi', true), row('Aguzzi'), row('Chen', true), row('Nobody')],
      teams,
    );

    expect(result.matched.map(({ teamName }) => teamName)).toEqual([
      'Alessi',
      'Aguzzi',
      'Chen',
    ]);
    expect(result.unmatched).toEqual([{ name: 'Nobody' }]);
    expect(result.matched.length + result.unmatched.length).toEqual(4);
  });

  it('Should keep the first occurrence of a repeated name', () => {
    const result = matchTeamNames(
      [
        row('Alessi', true),
        row('Team Alessi', false),
        row('Ghost'),
        row('ghost'),
      ],
      [team()],
    );

    expect(result.matched).toHaveLength(1);
    expect(result.matched[0]?.attended).toEqual(true);
    expect(result.unmatched).toEqual([{ name: 'Ghost' }]);
  });

  it('Should skip blank names', () => {
    const result = matchTeamNames([row('   '), row('')], [team()]);

    expect(result).toEqual({ matched: [], unmatched: [] });
  });

  it('Should match an inactive team and flag it', () => {
    const result = matchTeamNames(
      [row('Alessi')],
      [team({ inactiveSince: '2024-01-01T00:00:00.000Z' })],
    );

    expect(result.matched[0]?.isTeamInactive).toEqual(true);
  });
});
