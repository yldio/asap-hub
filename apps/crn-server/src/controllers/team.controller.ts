import { NotFoundError } from '@asap-hub/errors';
import {
  FetchPaginationOptions,
  FetchTeamsOptions,
  ListPublicTeamResponse,
  ListTeamResponse,
  TeamResponse,
  TeamTool,
} from '@asap-hub/model';
import { TeamDataProvider } from '../data-providers/types/teams.data-provider.types';

type FetchTeamOptions = {
  internalAPI: boolean;
  showTools: boolean;
};

export default class TeamController {
  teamDataProvider: TeamDataProvider;

  constructor(teamDataProvider: TeamDataProvider) {
    this.teamDataProvider = teamDataProvider;
  }

  async update(id: string, tools: TeamTool[]): Promise<TeamResponse> {
    const cleanUpdate = tools.map((tool) =>
      Object.entries(tool).reduce(
        (acc, [key, value]) =>
          value?.trim && value?.trim() === ''
            ? acc // deleted field
            : { ...acc, [key]: value },
        {} as TeamTool,
      ),
    );

    await this.teamDataProvider.update(id, { tools: cleanUpdate });

    return this.fetchById(id);
  }

  async fetch(options: FetchTeamsOptions): Promise<ListTeamResponse> {
    const { take = 8, skip = 0, search, filter } = options;

    const { total, items } = await this.teamDataProvider.fetch({
      take,
      skip,
      search,
      filter: filter?.length === 1 ? { active: filter[0] === 'Active' } : {},
    });

    return {
      total,
      items,
    };
  }

  async fetchPublicTeams(
    options: FetchPaginationOptions,
  ): Promise<ListPublicTeamResponse> {
    const { take = 8, skip = 0 } = options;

    const { total, items } = await this.teamDataProvider.fetchPublicTeams({
      take,
      skip,
    });

    return {
      total,
      items,
    };
  }

  async fetchById(
    teamId: string,
    options?: FetchTeamOptions,
  ): Promise<TeamResponse> {
    const internalAPI = options?.internalAPI ?? true;
    const team = await this.teamDataProvider.fetchById(teamId, internalAPI);

    if (!team) {
      throw new NotFoundError(undefined, `team with id ${teamId} not found`);
    }

    if (options?.showTools === false) {
      return {
        ...team,
        tools: undefined,
      };
    }

    return team;
  }
}
