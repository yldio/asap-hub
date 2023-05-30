import {
  FetchWorkingGroupOptions,
  WorkingGroupDataObject,
  WorkingGroupListDataObject,
  WorkingGroupRole,
  WorkingGroupUpdateDataObject,
} from '@asap-hub/model';
import {
  patchAndPublish,
  GraphQLClient,
  FETCH_WORKING_GROUPS,
  FETCH_WORKING_GROUP_BY_ID,
  FetchWorkingGroupByIdQuery,
  FetchWorkingGroupByIdQueryVariables,
  FetchWorkingGroupsQuery,
  FetchWorkingGroupsQueryVariables,
  Environment,
  parseRichText,
  RichTextFromQuery,
  WorkingGroupsFilter,
  addLocaleToFields,
  Link,
} from '@asap-hub/contentful';
import { WorkingGroupDataProvider } from '../types';
import { parseContentfulGraphqlCalendarToResponse } from '../../entities';
import { contentfulRateLimiter } from './contentful-rate-limiter';

export type WorkingGroupItem = NonNullable<
  NonNullable<
    FetchWorkingGroupsQuery['workingGroupsCollection']
  >['items'][number]
>;

export class WorkingGroupContentfulDataProvider
  implements WorkingGroupDataProvider
{
  constructor(
    private contentfulClient: GraphQLClient,
    private getRestClient: () => Promise<Environment>,
  ) {}

  async fetch(
    options: FetchWorkingGroupOptions,
  ): Promise<WorkingGroupListDataObject> {
    const { search, take = 10, skip = 0, filter } = options;

    const where: WorkingGroupsFilter = {};
    const words = (search || '').split(' ').filter(Boolean); // removes whitespaces

    if (words.length) {
      const filters: WorkingGroupsFilter[] = words.reduce(
        (acc: WorkingGroupsFilter[], word: string) =>
          acc.concat([
            {
              OR: [
                { title_contains: word },
                { description_contains: word },
                { shortText_contains: word },
              ],
            },
          ]),
        [],
      );
      where.AND = filters;
    }

    if (filter && filter.complete !== undefined) {
      where.AND = [...(where.AND || []), { complete: filter.complete }];
    }

    const { workingGroupsCollection } = await this.contentfulClient.request<
      FetchWorkingGroupsQuery,
      FetchWorkingGroupsQueryVariables
    >(FETCH_WORKING_GROUPS, {
      limit: take,
      skip,
      where,
    });

    if (!workingGroupsCollection?.items) {
      return {
        total: 0,
        items: [],
      };
    }

    return {
      total: workingGroupsCollection?.total,
      items: workingGroupsCollection?.items
        .filter((x): x is WorkingGroupItem => x !== null)
        .map(parseContentfulGraphQlWorkingGroup),
    };
  }

  async fetchById(id: string): Promise<WorkingGroupDataObject | null> {
    const { workingGroups } = await this.contentfulClient.request<
      FetchWorkingGroupByIdQuery,
      FetchWorkingGroupByIdQueryVariables
    >(FETCH_WORKING_GROUP_BY_ID, { id });

    if (!workingGroups) {
      return null;
    }

    return parseContentfulGraphQlWorkingGroup(workingGroups);
  }

  async update(
    id: string,
    update: WorkingGroupUpdateDataObject,
  ): Promise<void> {
    const environment = await this.getRestClient();
    const workingGroup = await environment.getEntry(id);

    await Promise.all(
      workingGroup.fields.deliverables['en-US'].map(
        async (deliverable: Link<'Entry'>) => {
          const deliverableId = deliverable.sys.id;
          await contentfulRateLimiter.removeTokens(1);
          const deliverableEntry = await environment.getEntry(deliverableId);
          await contentfulRateLimiter.removeTokens(1);

          if (deliverableEntry.isPublished()) {
            await contentfulRateLimiter.removeTokens(1);
            await deliverableEntry.unpublish();
          }

          await contentfulRateLimiter.removeTokens(1);
          await deliverableEntry.delete();
        },
      ),
    );

    const publishedDeliverables = await Promise.all(
      update.deliverables.map(async (deliverable) => {
        await contentfulRateLimiter.removeTokens(1);
        const entry = await environment.createEntry(
          'workingGroupDeliverables',
          {
            fields: addLocaleToFields(deliverable),
          },
        );

        await contentfulRateLimiter.removeTokens(1);
        return entry.publish();
      }),
    );

    const deliverables = publishedDeliverables.map((deliverable) => ({
      sys: {
        type: 'Link',
        linkType: 'Entry',
        id: deliverable.sys.id,
      },
    }));

    await contentfulRateLimiter.removeTokens(2);
    await patchAndPublish(workingGroup, { deliverables });
  }
}
export const parseContentfulGraphQlWorkingGroup = (
  item: WorkingGroupItem,
): WorkingGroupDataObject => {
  const {
    title,
    complete,
    externalLink,
    calendars,
    deliverablesCollection,
    sys,
    shortText,
    description,
    membersCollection,
  } = item;

  const deliverables = (deliverablesCollection?.items || []).reduce(
    (
      wgDeliverables: WorkingGroupDataObject['deliverables'][number][],
      deliverableItem,
    ) => {
      if (deliverableItem) {
        wgDeliverables.push({
          // these two fields are required in Contentful they can't be null
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          status: deliverableItem.status!,
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          description: deliverableItem.description!,
        } as WorkingGroupDataObject['deliverables'][number]);
      }

      return wgDeliverables;
    },
    [],
  );

  const { leaders, members } = (membersCollection?.items || []).reduce(
    (
      wgMembers: {
        leaders: WorkingGroupDataObject['leaders'][number][];
        members: WorkingGroupDataObject['members'][number][];
      },
      member,
    ) => {
      if (member) {
        const user = {
          id: member.user?.sys.id || '',
          firstName: member.user?.firstName || '',
          lastName: member.user?.lastName || '',
          displayName: `${member.user?.firstName} ${member.user?.lastName}`,
          alumniSinceDate: member.user?.alumniSinceDate,
          email: member.user?.email || '',
          avatarUrl: member.user?.avatar?.url || undefined,
        };

        if (member?.__typename === 'WorkingGroupLeaders') {
          wgMembers.leaders.push({
            role: member.role as WorkingGroupRole,
            workstreamRole: member.workstreamRole || '',
            inactiveSinceDate: member.inactiveSinceDate,
            user,
          });
        }

        if (member?.__typename === 'WorkingGroupMembers') {
          wgMembers.members.push({
            inactiveSinceDate: member.inactiveSinceDate,
            user,
          });
        }
      }
      return wgMembers;
    },
    {
      leaders: [],
      members: [],
    },
  );

  const workingGroup = {
    id: sys.id,
    title: title || '',
    description: description
      ? parseRichText(description as RichTextFromQuery)
      : '',
    lastModifiedDate: sys.publishedAt,
    shortText: shortText || '',
    complete: !!complete,
    deliverables,
    members,
    leaders,
    pointOfContact: leaders.find(
      ({ role, inactiveSinceDate, user: { alumniSinceDate } }) =>
        role === 'Project Manager' && !alumniSinceDate && !inactiveSinceDate,
    ),
    calendars: calendars
      ? [parseContentfulGraphqlCalendarToResponse(calendars)]
      : [],
  };

  return externalLink ? { ...workingGroup, externalLink } : workingGroup;
};
