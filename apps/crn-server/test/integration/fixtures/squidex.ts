import { omit } from 'lodash';
import {
  RestUser,
  InputUser,
  RestTeam,
  RestGroup,
  SquidexRest,
  parseToSquidex,
} from '@asap-hub/squidex';
import {
  UserCreateDataObject,
  TeamCreateDataObject,
  InterestGroupCreateDataObject,
} from './types';
import { appName, baseUrl } from '../../../src/config';

import { getAuthToken } from '../../../src/utils/auth';
import { teardownHelper } from '../../helpers/teardown';

import { Fixture } from './types';

const getSquidexClient = <
  T extends { id: string; data: Record<string, unknown> },
  Q extends { id: string; data: Record<string, unknown> } = T,
>(
  type: string,
) =>
  new SquidexRest<T, Q>(getAuthToken, type, {
    appName,
    baseUrl,
  });

const userRestClient = getSquidexClient<RestUser, InputUser>('users');
const teamRestClient = getSquidexClient<RestTeam>('teams');
const interestGroupRestClient = getSquidexClient<RestGroup>('groups');

export class SquidexFixture implements Fixture {
  private teardownHelper = teardownHelper([
    userRestClient,
    teamRestClient,
    interestGroupRestClient,
  ]);

  private async prepareUser(props: UserCreateDataObject) {
    let avatar: string[] | null = null;
    if (props.avatar) {
      avatar = [props.avatar];
    }
    return {
      ...props,
      onboarded: props.onboarded === true,
      connections: props.connections || [],
      dismissedGettingStarted: props.onboarded === true,
      teams: props.teams?.map((team) => ({
        id: [team.id],
        role: team.role,
        inactiveSinceDate: team.inactiveSinceDate,
      })),
      labs: [],
      social: props.social ? [props.social] : [],
      questions: [],
      degree: props.degree || null,
      avatar,
    };
  }

  private async prepareTeam(props: TeamCreateDataObject) {
    return props;
  }

  private async prepareInterestGroup(props: InterestGroupCreateDataObject) {
    return {
      ...omit(props, 'calendar'),
      teams: props.teams?.map((team) => team.id),
      leaders: props.leaders?.map((leader) => ({
        user: [leader.user],
        role: leader.role,
        inactiveSinceDate: leader.inactiveSinceDate,
      })),
      calendars: props.calendar ? [props.calendar.id] : null,
      tools: [],
      tags: [],
      thumbnail: null,
    };
  }

  async createUser(user: UserCreateDataObject) {
    const input = await this.prepareUser(user);
    const result = await userRestClient.create(parseToSquidex(input));
    if (!result) {
      throw new Error('Could not create user');
    }
    return {
      id: result.id,
      ...user,
    };
  }

  async createTeam(team: TeamCreateDataObject) {
    const input = await this.prepareTeam(team);
    const result = await teamRestClient.create(parseToSquidex(input));
    if (!result) {
      throw new Error('Could not create user');
    }
    return {
      id: result.id,
      ...team,
    };
  }

  async createInterestGroup(group: InterestGroupCreateDataObject) {
    const input = await this.prepareInterestGroup(group);
    const result = await interestGroupRestClient.create(parseToSquidex(input));
    if (!result) {
      throw new Error('Could not create user');
    }
    return {
      id: result.id,
      ...group,
    };
  }

  async teardown() {
    return this.teardownHelper();
  }
}
