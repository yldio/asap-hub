import { URL } from 'url';
import {
  GroupResponse,
  CalendarResponse,
  GroupTeam,
  GroupTools,
  GroupRole,
} from '@asap-hub/model';
import { GraphqlGroup, GraphqlUser } from '@asap-hub/squidex';

import { parseGraphQLTeam } from './team';
import { parseGraphQLUser } from './user';
import { parseGraphQLCalendar } from './calendar';
import { parseDate, createURL } from '../utils/squidex';

export const parseGraphQLGroup = (item: GraphqlGroup): GroupResponse => {
  const createdDate = parseDate(item.created).toISOString();
  const teams: GroupTeam[] = (item.flatData?.teams || []).map((t) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { members, outputs, ...team } = parseGraphQLTeam(t, []);
    return team;
  });
  const calendars: CalendarResponse[] = (item.flatData?.calendars || []).map(
    parseGraphQLCalendar,
  );
  const leaders: GroupResponse['leaders'] = (item.flatData?.leaders || [])
    .filter(
      (leader): leader is { user: GraphqlUser[]; role: GroupRole } =>
        !!leader.user[0],
    )
    .map((leader) => ({
      user: parseGraphQLUser(leader.user[0]),
      role: leader.role,
    }));
  let tools: GroupTools = {};
  if (item.flatData?.tools?.length) {
    const [groupTools] = item.flatData?.tools;
    if (groupTools.slack) {
      tools = { ...tools, slack: groupTools.slack };
    }

    if (groupTools.googleDrive) {
      tools = { ...tools, googleDrive: groupTools.googleDrive };
    }
  }

  if (item.flatData?.calendars?.length) {
    const url = new URL('https://calendar.google.com/calendar/r');
    url.searchParams.set('cid', item.flatData?.calendars[0].id);
    tools = { ...tools, googleCalendar: url.toString() };
  }

  return {
    id: item.id,
    createdDate,
    name: item.flatData?.name || '',
    tags: item.flatData?.tags || [],
    description: item.flatData?.description || '',
    tools,
    teams,
    leaders,
    calendars,
    thumbnail: item.flatData?.thumbnail?.length
      ? createURL(item.flatData.thumbnail.map((t) => t.id))[0]
      : undefined,
    lastModifiedDate: parseDate(item.lastModified).toISOString(),
  };
};
