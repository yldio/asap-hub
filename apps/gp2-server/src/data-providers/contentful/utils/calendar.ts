import { GraphQLProject } from '../project.data-provider';
import { GraphQLWorkingGroup } from '../working-group.data-provider';

export const parseCalendar = (
  calendar: GraphQLWorkingGroup['calendar'] | GraphQLProject['calendar'],
) =>
  calendar
    ? {
        id: calendar.sys.id,
        name: calendar.name || '',
      }
    : undefined;
