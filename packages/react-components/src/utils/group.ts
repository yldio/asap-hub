import {
  ProjectMember,
  ProjectMemberTeam,
  TeamMember,
  TeamRole,
  UserTeam,
} from '@asap-hub/model';

export type GroupedUserTeam = {
  id: string;
  displayName?: string;
  teamInactiveSince?: string;
  proposal?: string;
  roles: TeamRole[];
  inactiveSinceDate?: string;
};

export const groupUserTeamsByTeamId = (
  teams: UserTeam[],
): GroupedUserTeam[] => {
  const teamMap = new Map<string, GroupedUserTeam>();

  for (const team of teams) {
    const existing = teamMap.get(team.id);
    if (existing) {
      if (!existing.roles.includes(team.role)) {
        existing.roles.push(team.role);
      }
      if (team.inactiveSinceDate && existing.inactiveSinceDate) {
        existing.inactiveSinceDate =
          team.inactiveSinceDate > existing.inactiveSinceDate
            ? team.inactiveSinceDate
            : existing.inactiveSinceDate;
      } else if (!team.inactiveSinceDate) {
        existing.inactiveSinceDate = undefined;
      }
    } else {
      teamMap.set(team.id, {
        id: team.id,
        displayName: team.displayName,
        teamInactiveSince: team.teamInactiveSince,
        proposal: team.proposal,
        roles: [team.role],
        inactiveSinceDate: team.inactiveSinceDate,
      });
    }
  }

  return Array.from(teamMap.values());
};

export type GroupedTeamMember = Omit<TeamMember, 'role'> & {
  roles: TeamRole[];
};

export const groupTeamMembersByUserId = (
  members: TeamMember[],
): GroupedTeamMember[] => {
  const memberMap = new Map<string, GroupedTeamMember>();

  for (const member of members) {
    const existing = memberMap.get(member.id);
    if (existing) {
      if (!existing.roles.includes(member.role)) {
        existing.roles.push(member.role);
      }
      const newLabs = (member.labs || []).filter(
        (lab) => !(existing.labs || []).some((l) => l.id === lab.id),
      );
      if (newLabs.length) {
        existing.labs = [...(existing.labs || []), ...newLabs];
      }
      if (member.inactiveSinceDate && existing.inactiveSinceDate) {
        existing.inactiveSinceDate =
          member.inactiveSinceDate > existing.inactiveSinceDate
            ? member.inactiveSinceDate
            : existing.inactiveSinceDate;
      } else if (!member.inactiveSinceDate) {
        existing.inactiveSinceDate = undefined;
      }
      if (!member.alumniSinceDate) {
        existing.alumniSinceDate = undefined;
      }
    } else {
      const { role, ...rest } = member;
      memberMap.set(member.id, { ...rest, roles: [role] });
    }
  }

  return Array.from(memberMap.values());
};

export type GroupedProjectMember = {
  id: string;
  displayName: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  email?: string;
  alumniSinceDate?: string;
  href?: string;
  teams?: ProjectMemberTeam[];
  roles: string[];
};

export const groupProjectMembersByUserId = (
  members: readonly ProjectMember[],
): GroupedProjectMember[] => {
  const memberMap = new Map<string, GroupedProjectMember>();

  for (const member of members) {
    const existing = memberMap.get(member.id);
    if (existing) {
      if (member.role && !existing.roles.includes(member.role)) {
        existing.roles.push(member.role);
      }
      const newTeams = (member.teams || []).filter(
        (t) => !(existing.teams || []).some((et) => et.id === t.id),
      );
      if (newTeams.length) {
        existing.teams = [...(existing.teams || []), ...newTeams];
      }
    } else {
      memberMap.set(member.id, {
        id: member.id,
        displayName: member.displayName,
        firstName: member.firstName,
        lastName: member.lastName,
        avatarUrl: member.avatarUrl,
        email: member.email,
        alumniSinceDate: member.alumniSinceDate,
        href: member.href,
        teams: member.teams ? [...member.teams] : undefined,
        roles: member.role ? [member.role] : [],
      });
    }
  }

  return Array.from(memberMap.values());
};
