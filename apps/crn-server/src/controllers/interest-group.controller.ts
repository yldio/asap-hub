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

    const groupFilter =
      filter?.length === 1
        ? {
            filter: {
              active: filter[0] === 'Active',
            },
          }
        : {};

    const { total, items } = await this.interestGroupDataProvider.fetch({
      ...fetchOptions,
      ...groupFilter,
    });

    return { total, items };
  }

  async fetchById(groupId: string): Promise<InterestGroupResponse> {
    const group = await this.interestGroupDataProvider.fetchById(groupId);
    if (!group) {
      throw new NotFoundError(undefined, `group with id ${groupId} not found`);
    }

    return group;
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
    const { items: groupsByTeams } = await this.interestGroupDataProvider.fetch(
      {
        filter: {
          teamId: teamIds,
        },
      },
    );
    const { items: groupsByUser } = await this.interestGroupDataProvider.fetch({
      filter: {
        userId,
      },
    });
    const groups = [...groupsByTeams, ...groupsByUser];
    const items = uniqBy(groups, 'id');

    return { total: items.length, items };
  }
}
