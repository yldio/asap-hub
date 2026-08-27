import { TeamListItemResponse } from '@asap-hub/model';
import {
  EventAttendanceTeam,
  UploadListResult,
  UploadListUnmatchedTeam,
} from '@asap-hub/react-components';

// The Hub renders Teams as `Team {displayName}` but stores the bare
// displayName, so a list transcribed from the UI carries a prefix that is not
// part of any stored name.
export const normalizeTeamName = (name: string): string =>
  name
    .trim()
    .replace(/\s+/g, ' ')
    .toLowerCase()
    .replace(/^team /, '');

const toAttendanceTeam = (team: TeamListItemResponse): EventAttendanceTeam => ({
  teamId: team.id,
  teamName: team.displayName,
  attended: true,
  teamType: team.teamType,
  isTeamInactive: !!team.inactiveSince,
});

export const matchTeamNames = (
  names: string[],
  teams: TeamListItemResponse[],
  currentRows: EventAttendanceTeam[],
): UploadListResult => {
  const teamsByName = new Map(
    teams.map((team) => [normalizeTeamName(team.displayName), team]),
  );
  const currentTeamIds = new Set(currentRows.map(({ teamId }) => teamId));

  const matched: EventAttendanceTeam[] = [];
  const unmatched: UploadListUnmatchedTeam[] = [];
  const seen = new Set<string>();
  let alreadyInCount = 0;

  names.forEach((name) => {
    const normalized = normalizeTeamName(name);
    if (!normalized || seen.has(normalized)) {
      return;
    }
    seen.add(normalized);

    const team = teamsByName.get(normalized);
    if (!team) {
      unmatched.push({ name: name.trim() });
    } else if (currentTeamIds.has(team.id)) {
      // Counted, never listed: the modal's total is
      // matched + alreadyInCount + unmatched, so the sets must stay disjoint.
      alreadyInCount += 1;
    } else {
      matched.push(toAttendanceTeam(team));
    }
  });

  return { matched, alreadyInCount, unmatched };
};
