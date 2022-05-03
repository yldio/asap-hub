import { User } from '@asap-hub/auth';
import { ResearchOutputPostRequest } from '@asap-hub/model';

export const hasCreateResearchOutputPermissions = (
  user: Omit<User, 'algoliaApiKey'>,
  teams: ResearchOutputPostRequest['teams'],
): boolean =>
  !!user.teams?.find((team) => {
    if (team.role === 'ASAP Staff') {
      return true;
    }

    return teams.includes(team.id) && team.role === 'Project Manager';
  });
