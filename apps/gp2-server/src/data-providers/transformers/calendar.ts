import { gp2, gp2 as gp2Contentful } from '@asap-hub/contentful';
import { gp2 as gp2Model, isGoogleLegacyCalendarColor } from '@asap-hub/model';
import { GraphQLProject } from '../project.data-provider';
import { GraphQLWorkingGroup } from '../working-group.data-provider';

export const parseContentfulGraphqlCalendarPartialToDataObject = (
  graphqlCalendar: Pick<
    NonNullable<
      NonNullable<
        gp2.FetchCalendarsQuery['calendarsCollection']
      >['items'][number]
    >,
    'name' | 'googleCalendarId' | 'color'
  >,
): Pick<
  gp2Model.CalendarDataObject,
  'name' | 'googleCalendarId' | 'color'
> => ({
  color:
    graphqlCalendar.color && isGoogleLegacyCalendarColor(graphqlCalendar.color)
      ? graphqlCalendar.color
      : ('#333333' as const),
  googleCalendarId: graphqlCalendar.googleCalendarId ?? '',
  name: graphqlCalendar.name ?? '',
});

export const parseCalendar = (
  calendar: GraphQLWorkingGroup['calendar'] | GraphQLProject['calendar'],
) =>
  calendar
    ? {
        id: calendar.sys.id,
        name: calendar.name ?? '',
      }
    : undefined;

type ProjectsWorkingGroups = {
  projects?: Pick<gp2Model.ProjectDataObject, 'id' | 'title'>[];
  workingGroups?: Pick<gp2Model.WorkingGroupDataObject, 'id' | 'title'>[];
};

export const parseContentfulWorkingGroupsProjects = (calendar?: {
  linkedFrom?: gp2Contentful.Maybe<{
    workingGroupsCollection?:
      | gp2Contentful.Maybe<{
          items: gp2Contentful.Maybe<
            Pick<gp2Contentful.WorkingGroups, 'title'> & {
              sys: Pick<gp2Contentful.Sys, 'id'>;
            }
          >[];
        }>
      | undefined;
    projectsCollection?:
      | gp2Contentful.Maybe<{
          items: gp2Contentful.Maybe<
            Pick<gp2Contentful.Projects, 'title'> & {
              sys: Pick<gp2Contentful.Sys, 'id'>;
            }
          >[];
        }>
      | undefined;
  }>;
}): ProjectsWorkingGroups => {
  const projects =
    calendar?.linkedFrom?.projectsCollection?.items.map((item) => ({
      id: item?.sys.id ?? '',
      title: item?.title ?? '',
    })) || [];

  const workingGroups =
    calendar?.linkedFrom?.workingGroupsCollection?.items.map((item) => ({
      id: item?.sys.id ?? '',
      title: item?.title ?? '',
    })) || [];

  return { projects, workingGroups };
};
