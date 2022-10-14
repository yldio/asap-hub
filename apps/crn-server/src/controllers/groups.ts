import { NotFoundError } from '@asap-hub/errors';
import {
  FetchOptions,
  FetchPaginationOptions,
  GroupResponse,
  ListGroupResponse,
} from '@asap-hub/model';
import uniqBy from 'lodash.uniqby';
import { GroupDataProvider } from '../data-providers/groups.data-provider';
import { UserDataProvider } from '../data-providers/users.data-provider';

export interface GroupController {
  fetch: (options: FetchOptions) => Promise<ListGroupResponse>;
  fetchById: (groupId: string) => Promise<GroupResponse>;
  fetchByTeamId: (
    teamId: string | string[],
    options: FetchOptions,
  ) => Promise<ListGroupResponse>;
  fetchByUserId: (userId: string) => Promise<ListGroupResponse>;
}

export default class Groups implements GroupController {
  groupDataProvider: GroupDataProvider;
  userDataProvider: UserDataProvider;

  constructor(
    groupDataProvider: GroupDataProvider,
    userDataProvider: UserDataProvider,
  ) {
    this.groupDataProvider = groupDataProvider;
    this.userDataProvider = userDataProvider;
  }

  async fetch(options: FetchOptions): Promise<ListGroupResponse> {
    const { filter, ...fetchOptions } = options;

    const groupFilter =
      filter?.length === 1
        ? {
            filter: {
              active: filter[0] === 'Active',
            },
          }
        : {};

    const { total, items } = await this.groupDataProvider.fetch({
      ...fetchOptions,
      ...groupFilter,
    });

    return { total, items };
  }

  async fetchById(groupId: string): Promise<GroupResponse> {
    const group = await this.groupDataProvider.fetchById(groupId);
    if (!group) {
      throw new NotFoundError(undefined, `group with id ${groupId} not found`);
    }

    return group;
  }

  async fetchByTeamId(
    teamId: string | string[],
    options: FetchPaginationOptions,
  ): Promise<ListGroupResponse> {
    const teamIds = Array.isArray(teamId) ? teamId : [teamId];
    const { total, items } = await this.groupDataProvider.fetch({
      filter: {
        teamId: teamIds,
      },
      ...options,
    });

    return { total, items };
  }

  async fetchByUserId(userId: string): Promise<ListGroupResponse> {
    const user = await this.userDataProvider.fetchById(userId);

    if (!user) {
      throw new NotFoundError(undefined, 'User not found');
    }

    const teamIds = user.teams.map((team) => team.id);
    const { items: groupsByTeams } = await this.groupDataProvider.fetch({
      filter: {
        teamId: teamIds,
      },
    });
    const { items: groupsByUser } = await this.groupDataProvider.fetch({
      filter: {
        userId,
      },
    });
    const groups = [...groupsByTeams, ...groupsByUser];
    const items = uniqBy(groups, 'id');

    return { total: items.length, items };
  }
}
