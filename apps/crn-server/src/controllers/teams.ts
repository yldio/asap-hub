import { NotFoundError } from '@asap-hub/errors';
import { ListTeamResponse, TeamResponse, TeamTool } from '@asap-hub/model';
import { FetchOptions } from '../utils/types';
import { TeamDataProvider } from '../data-providers/teams.data-provider';

export interface TeamController {
  update: (id: string, tools: TeamTool[]) => Promise<TeamResponse>;
  fetch: (options: FetchTeamsOptions) => Promise<ListTeamResponse>;
  fetchById: (
    teamId: string,
    options?: FetchTeamOptions,
  ) => Promise<TeamResponse>;
}

type FetchTeamOptions = {
  showTools: boolean;
};

export type FetchTeamsOptions = {
  // select team IDs of which tools should be returned
  // leave undefined to return all teams' tools
  showTeamTools?: string[];
} & Omit<FetchOptions, 'filter'>;
export default class Teams implements TeamController {
  teamDataProvider: TeamDataProvider;

  constructor(teamsDataProvider: TeamDataProvider) {
    this.teamDataProvider = teamsDataProvider;
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
    const { take = 8, skip = 0, search } = options;

    const { total, items } = await this.teamDataProvider.fetch({
      take,
      skip,
      search,
    });

    return {
      total,
      items: items.map((team) => {
        if (!options.showTeamTools || options.showTeamTools.includes(team.id)) {
          return team;
        }

        return {
          ...team,
          tools: undefined,
        };
      }),
    };
  }

  async fetchById(
    teamId: string,
    options?: FetchTeamOptions,
  ): Promise<TeamResponse> {
    const team = await this.teamDataProvider.fetchById(teamId);

    if (!team) {
      throw new NotFoundError(`team with id ${teamId} not found`);
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
