import { omit } from 'lodash';
import {
  RestUser,
  InputUser,
  RestTeam,
  RestGroup,
  SquidexRest,
  parseToSquidex,
  RestEvent,
  RestCalendar,
  InputCalendar,
} from '@asap-hub/squidex';
import {
  CalendarCreateDataObject,
  EventCreateDataObject,
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

const calendarRestClient = getSquidexClient<RestCalendar, InputCalendar>(
  'calendars',
);
const eventRestClient = getSquidexClient<RestEvent>('events');
const userRestClient = getSquidexClient<RestUser, InputUser>('users');
const teamRestClient = getSquidexClient<RestTeam>('teams');
const interestGroupRestClient = getSquidexClient<RestGroup>('groups');

export class SquidexFixture implements Fixture {
  private teardownHelper = teardownHelper([
    calendarRestClient,
    eventRestClient,
    userRestClient,
    teamRestClient,
    interestGroupRestClient,
  ]);

  private async prepareCalendar(props: CalendarCreateDataObject) {
    return props;
  }

  private async prepareEvent(props: EventCreateDataObject) {
    return {
      ...props,
      calendar: [props.calendar],
      notes: props.notes ?? undefined,
      presentation: props.presentation ?? undefined,
      videoRecording: props.videoRecording ?? undefined,
    };
  }

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

  async createCalendar(calendar: CalendarCreateDataObject) {
    const input = await this.prepareCalendar(calendar);
    const result = await calendarRestClient.create(parseToSquidex(input));
    if (!result) {
      throw new Error('Could not create calendar');
    }
    return {
      id: result.id,
      ...calendar,
    };
  }

  async createEvent(event: EventCreateDataObject) {
    const input = await this.prepareEvent(event);
    const result = await eventRestClient.create(parseToSquidex(input));
    if (!result) {
      throw new Error('Could not create event');
    }
    return {
      id: result.id,
      ...event,
    };
  }

  async publishEvent(id: string, status?: 'Published' | 'Draft') {
    const result = await eventRestClient.publish(id, status);
    if (!result) {
      throw new Error('Could not publish event');
    }
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
      throw new Error('Could not create team');
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
      throw new Error('Could not create interest group');
    }
    return {
      id: result.id,
      ...group,
    };
  }

  async teardown() {
    // no need to teardown in CI because we'll delete the environment anyway
    if (process.env.CI) {
      return;
    }
    return this.teardownHelper();
  }

  async deleteEvents(ids: string[]) {
    for (const id of ids) {
      await eventRestClient.delete(id);
    }
  }

  async clearAllPreviousEvents() {
    // not needed in squidex
  }
}
