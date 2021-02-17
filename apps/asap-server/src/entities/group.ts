import { URL } from 'url';
import {
  GroupResponse,
  TeamResponse,
  CalendarResponse,
  GroupTeam,
  GroupTools,
} from '@asap-hub/model';
import { GraphqlGroup } from '@asap-hub/squidex';

import { parseGraphQLTeam } from './team';
import { parseGraphQLUser } from './user';
import { parseGraphQLCalendar } from './calendar';
import { parseDate } from '../utils/squidex';

export const parseGraphQLGroup = (item: GraphqlGroup): GroupResponse => {
  const createdDate = parseDate(item.created).toISOString();
  const teams: GroupTeam[] = (item.flatData?.teams || []).map((t) => {
    const team: TeamResponse = parseGraphQLTeam(t, []);
    delete team.members;
    return team;
  });
  const calendars: CalendarResponse[] = (item.flatData?.calendars || []).map(
    parseGraphQLCalendar,
  );
  const leaders: GroupResponse['leaders'] = (item.flatData?.leaders || []).map(
    (leader) => ({
      user: parseGraphQLUser(leader.user[0]),
      role: leader.role,
    }),
  );

  const tools: GroupTools = {};
  if (item.flatData?.tools?.length) {
    const [groupTools] = item.flatData?.tools;
    if (groupTools.slack) {
      tools.slack = groupTools.slack;
    }

    if (groupTools.googleDrive) {
      tools.googleDrive = groupTools.googleDrive;
    }
  }

  if (item.flatData?.calendars?.length) {
    const url = new URL('https://calendar.google.com/calendar/r');
    url.searchParams.set('cid', item.flatData?.calendars[0].id);
    tools.googleCalendar = url.toString();
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
    lastModifiedDate: parseDate(item.lastModified).toISOString(),
  };
};
