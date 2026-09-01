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

// Resolves uploaded names to Hub Teams; the modal decides which are already on
// the table (it owns the live rows, including unsaved additions).
export const matchTeamNames = (
  rows: ParsedTeamRow[],
  teams: TeamListItemResponse[],
): UploadListResult => {
  const teamsByName = new Map(
    teams.map((team) => [normalizeTeamName(team.displayName), team]),
  );

  const matched: EventAttendanceTeam[] = [];
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

    matched.push(toAttendanceTeam(team, attended));
  });

  return { matched, unmatched };
};
