import { NotFoundError } from '@asap-hub/errors';
import {
  FetchOptions,
  FetchPaginationOptions,
  InterestGroupResponse,
  ListInterestGroupResponse,
} from '@asap-hub/model';
import uniqBy from 'lodash.uniqby';
import {
  UserDataProvider,
  InterestGroupDataProvider,
} from '../data-providers/types';

export default class InterestGroupController {
  interestGroupDataProvider: InterestGroupDataProvider;
  userDataProvider: UserDataProvider;

  constructor(
    interestGroupDataProvider: InterestGroupDataProvider,
    userDataProvider: UserDataProvider,
  ) {
    this.interestGroupDataProvider = interestGroupDataProvider;
    this.userDataProvider = userDataProvider;
  }

  async fetch(options: FetchOptions): Promise<ListInterestGroupResponse> {
    const { filter, ...fetchOptions } = options;

    const interestGroupFilter =
      filter?.length === 1
        ? {
            filter: {
              active: filter[0] === 'Active',
            },
          }
        : {};

    const { total, items } = await this.interestGroupDataProvider.fetch({
      ...fetchOptions,
      ...interestGroupFilter,
    });

    return { total, items };
  }

  async fetchById(interestGroupId: string): Promise<InterestGroupResponse> {
    const interestGroup = await this.interestGroupDataProvider.fetchById(
      interestGroupId,
    );
    if (!interestGroup) {
      throw new NotFoundError(
        undefined,
        `group with id ${interestGroupId} not found`,
      );
    }

    return interestGroup;
  }

  async fetchByTeamId(
    teamId: string | string[],
    options: FetchPaginationOptions,
  ): Promise<ListInterestGroupResponse> {
    const teamIds = Array.isArray(teamId) ? teamId : [teamId];
    const { total, items } = await this.interestGroupDataProvider.fetch({
      filter: {
        teamId: teamIds,
      },
      ...options,
    });

    return { total, items };
  }

  async fetchByUserId(userId: string): Promise<ListInterestGroupResponse> {
    const user = await this.userDataProvider.fetchById(userId);

    if (!user) {
      throw new NotFoundError(undefined, 'User not found');
    }

    const teamIds = user.teams.map((team) => team.id);
    const { items: interestGroupsByTeams } = teamIds.length
      ? await this.interestGroupDataProvider.fetch({
          filter: {
            teamId: teamIds,
          },
        })
      : {
          items: [],
        };

    const { items: interestGroupsByUser } =
      await this.interestGroupDataProvider.fetch({
        filter: {
          userId,
        },
      });

    const interestGroups = [...interestGroupsByTeams, ...interestGroupsByUser];
    const items = uniqBy(interestGroups, 'id');

    return { total: items.length, items };
  }
}
