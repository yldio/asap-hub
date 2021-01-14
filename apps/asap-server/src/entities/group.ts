import {
  GroupResponse,
  TeamResponse,
  CalendarResponse,
  GroupTeam,
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

  return {
    id: item.id,
    createdDate,
    name: item.flatData?.name || '',
    tags: item.flatData?.tags || [],
    description: item.flatData?.description || '',
    summary: item.flatData?.summary || '',
    tools: item.flatData?.tools || [],
    teams,
    leaders,
    calendars,
  };
};
