import { TeamType } from '@asap-hub/model';

import { DiscoveryTeamIcon, ResourceTeamIcon, TeamIcon } from '../icons';

export const defaultVisibleTeams = 10;

export type EventTeamType = TeamType;

export const teamIcon = (teamType?: EventTeamType) => {
  switch (teamType) {
    case 'Discovery Team':
      return <DiscoveryTeamIcon />;
    case 'Resource Team':
      return <ResourceTeamIcon />;
    default:
      return <TeamIcon />;
  }
};
