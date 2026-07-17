import { DiscoveryTeamIcon, ResourceTeamIcon, TeamIcon } from '../icons';

export const defaultVisibleTeams = 10;

export type EventTeamType = 'discovery' | 'resource';

export const teamIcon = (teamType?: EventTeamType) => {
  switch (teamType) {
    case 'discovery':
      return <DiscoveryTeamIcon />;
    case 'resource':
      return <ResourceTeamIcon />;
    default:
      return <TeamIcon />;
  }
};
