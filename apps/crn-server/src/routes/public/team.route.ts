import {
  ListPublicTeamResponse,
  PublicTeamResponse,
  TeamDataObject,
} from '@asap-hub/model';
import { validateFetchPaginationOptions } from '@asap-hub/server-common';
import { Response, Router } from 'express';

import TeamController from '../../controllers/team.controller';

export const teamRouteFactory = (teamController: TeamController): Router => {
  const teamRoutes = Router();

  teamRoutes.get(
    '/teams',
    async (req, res: Response<ListPublicTeamResponse>) => {
      const { query } = req;

      const options = validateFetchPaginationOptions(query);

      const result = await teamController.fetchPublicTeams({
        ...options,
      });

      res.json({
        total: result.total,
        items: result.items,
      });
    },
  );

  teamRoutes.get(
    '/teams/:teamId',
    async (req, res: Response<PublicTeamResponse>) => {
      const { teamId } = req.params;

      const team = await teamController.fetchById(teamId, {
        showTools: false,
        internalAPI: false,
      });

      res.json(mapTeamToPublicTeam(team));
    },
  );

  return teamRoutes;
};

const mapTeamToPublicTeam = (team: TeamDataObject): PublicTeamResponse => ({
  id: team.id,
  name: team.displayName,
  status: team.inactiveSince ? 'Inactive' : 'Active',
  title: team.projectTitle,
  projectSummary: team.projectSummary,
  researchTheme: team.researchTheme,
  tags: team.tags?.map((tag) => tag.name) || [],
  members: team.members.map((member) => ({
    id: member.id,
    role: member.role,
    firstName: member.firstName,
    lastName: member.lastName,
    displayName: member.displayName,
    avatarUrl: member.avatarUrl,
    status:
      member.alumniSinceDate || member.inactiveSinceDate
        ? 'Inactive'
        : 'Active',
  })),
});
