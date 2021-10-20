import { URL } from 'url';
import {
  GroupResponse,
  CalendarResponse,
  GroupTeam,
  GroupTools,
  GroupLeader,
  isGroupRole,
  GroupRole,
} from '@asap-hub/model';
import { GraphqlUser } from '@asap-hub/squidex';

import { parseGraphQLTeam } from './team';
import { parseGraphQLUser } from './user';
import { parseGraphQLCalendar } from './calendar';
import { parseDate, createURL } from '../utils/squidex';
import { FetchGroupQuery, Calendars } from '../gql/graphql';

export const parseGraphQLGroup = (
  item: NonNullable<FetchGroupQuery['findGroupsContent']>,
): GroupResponse => {
  const createdDate = parseDate(item.created).toISOString();
  const teams: GroupTeam[] = (item.flatData.teams || []).map((t) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { members, outputs, labCount, ...team } = parseGraphQLTeam(t);
    return team;
  });
  const calendars: CalendarResponse[] = (item.flatData?.calendars || []).map(
    (c) => parseGraphQLCalendar(c as Calendars), // @todo remove cast
  );

  const leaders = (item.flatData.leaders || []).reduce(
    (leaderList: GroupLeader[], leader) => {
      if (leader.user === null || !leader.user[0]) {
        return leaderList;
      }
      if (!isGroupRole(leader.role)) {
        throw new Error(`Invalid group role on leaders : ${leader.role}`);
      }

      return [
        ...leaderList,
        {
          // TODO: remove cast after user types
          user: parseGraphQLUser(leader.user[0] as GraphqlUser),
          role: leader.role as GroupRole,
        },
      ];
    },
    [],
  );

  let tools: GroupTools = {};
  if (item.flatData.tools?.length) {
    const [groupTools] = item.flatData.tools;
    if (groupTools.slack) {
      tools = { ...tools, slack: groupTools.slack };
    }

    if (groupTools?.googleDrive) {
      tools = { ...tools, googleDrive: groupTools.googleDrive };
    }
  }

  if (item.flatData?.calendars?.length && item.flatData?.calendars[0]) {
    const url = new URL('https://calendar.google.com/calendar/r');
    url.searchParams.set('cid', item.flatData.calendars[0].id || '');
    tools = { ...tools, googleCalendar: url.toString() };
  }

  return {
    id: item.id,
    createdDate,
    name: item.flatData.name || '',
    tags: item.flatData.tags || [],
    description: item.flatData.description || '',
    tools,
    teams,
    leaders,
    calendars,
    thumbnail: item.flatData.thumbnail?.length
      ? createURL(item.flatData.thumbnail.map((t) => t.id))[0]
      : undefined,
    lastModifiedDate: parseDate(item.lastModified).toISOString(),
  };
};
