import { TeamListItemResponse } from '@asap-hub/model';
import {
  EventAttendanceTeam,
  UploadListResult,
  UploadListUnmatchedTeam,
} from '@asap-hub/react-components';

import { ParsedTeamRow } from './parse-team-list';

export const normalizeTeamName = (name: string): string =>
  name
    .trim()
    .replace(/\s+/g, ' ')
    .toLowerCase()
    .replace(/^team /, '');

const toAttendanceTeam = (
  team: TeamListItemResponse,
  attended: boolean,
): EventAttendanceTeam => ({
  teamId: team.id,
  teamName: team.displayName,
  attended,
  teamType: team.teamType,
  isTeamInactive: !!team.inactiveSince,
});

export const matchTeamNames = (
  rows: ParsedTeamRow[],
  teams: TeamListItemResponse[],
  currentRows: EventAttendanceTeam[],
): UploadListResult => {
  const teamsByName = new Map(
    teams.map((team) => [normalizeTeamName(team.displayName), team]),
  );
  const currentTeamIds = new Set(currentRows.map(({ teamId }) => teamId));

  const matched: EventAttendanceTeam[] = [];
  const alreadyIn: EventAttendanceTeam[] = [];
  const unmatched: UploadListUnmatchedTeam[] = [];
  const seen = new Set<string>();

  rows.forEach(({ name, attended }) => {
    const normalized = normalizeTeamName(name);
    if (!normalized || seen.has(normalized)) {
      return;
    }
    seen.add(normalized);

    const team = teamsByName.get(normalized);
    if (!team) {
      unmatched.push({ name: name.trim() });
      return;
    }

    const entry = toAttendanceTeam(team, attended);
    if (currentTeamIds.has(team.id)) {
      alreadyIn.push(entry);
    } else {
      matched.push(entry);
    }
  });

  return { matched, alreadyIn, unmatched };
};
