import { TeamListItemResponse } from '@asap-hub/model';
import {
  EventAttendanceTeam,
  UploadListResult,
  UploadListUnmatchedTeam,
} from '@asap-hub/react-components';

import { ParsedTeamRow } from './parse-team-list';

const normalizeFull = (name: string): string =>
  name.trim().replace(/\s+/g, ' ').toLowerCase();

const stripTeamPrefix = (normalized: string): string =>
  normalized.replace(/^team /, '');

export const normalizeTeamName = (name: string): string =>
  stripTeamPrefix(normalizeFull(name));

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
  const byFullName = new Map<string, TeamListItemResponse>();
  const strippedCounts = new Map<string, number>();
  teams.forEach((team) => {
    const stripped = normalizeTeamName(team.displayName);
    byFullName.set(normalizeFull(team.displayName), team);
    strippedCounts.set(stripped, (strippedCounts.get(stripped) ?? 0) + 1);
  });
  // Only resolve via the stripped ('Team X' -> 'X') form when it is unambiguous;
  // otherwise a real team named 'Team X' would shadow a team named 'X'.
  const byStrippedName = new Map<string, TeamListItemResponse>();
  teams.forEach((team) => {
    const stripped = normalizeTeamName(team.displayName);
    if (strippedCounts.get(stripped) === 1) {
      byStrippedName.set(stripped, team);
    }
  });

  const matched: EventAttendanceTeam[] = [];
  const unmatched: UploadListUnmatchedTeam[] = [];
  const seenTeamIds = new Set<string>();
  const seenUnmatched = new Set<string>();

  rows.forEach(({ name, attended }) => {
    const full = normalizeFull(name);
    if (!full) {
      return;
    }

    const team =
      byFullName.get(full) ?? byStrippedName.get(stripTeamPrefix(full));
    if (!team) {
      if (!seenUnmatched.has(full)) {
        seenUnmatched.add(full);
        unmatched.push({ name: name.trim() });
      }
      return;
    }

    if (!seenTeamIds.has(team.id)) {
      seenTeamIds.add(team.id);
      matched.push(toAttendanceTeam(team, attended));
    }
  });

  return { matched, unmatched };
};
