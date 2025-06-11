import {
  FetchWorkingGroupOptions,
  WorkingGroupDataObject,
  WorkingGroupDeliverable,
  WorkingGroupLeader,
  WorkingGroupListDataObject,
  WorkingGroupMember,
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
import { parseUserDisplayName } from '@asap-hub/server-common';

import { WorkingGroupDataProvider } from '../types';
import {
  parseContentfulGraphqlCalendarToResponse,
  mapDeliverables,
} from '../transformers';
import { cleanArray } from '../../utils/clean-array';
import logger from '../../utils/logger';
import { parseTeamsCollection } from './user.data-provider';

export type WorkingGroupItem = NonNullable<
  NonNullable<
    FetchWorkingGroupsQuery['workingGroupsCollection']
  >['items'][number]
>;

type MemberItem = NonNullable<
  NonNullable<WorkingGroupItem['membersCollection']>['items'][number]
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

  async fetchById(
    id: string,
    publicAPI: boolean = false,
  ): Promise<WorkingGroupDataObject | null> {
    const { workingGroups } = await this.contentfulClient.request<
      FetchWorkingGroupByIdQuery,
      FetchWorkingGroupByIdQueryVariables
    >(FETCH_WORKING_GROUP_BY_ID, { id, publicAPI });

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
          try {
            const deliverableId = deliverable.sys.id;
            const deliverableEntry = await environment.getEntry(deliverableId);

            try {
              if (deliverableEntry.isPublished()) {
                await deliverableEntry.unpublish();
              }
              try {
                await deliverableEntry.delete();
              } catch {
                logger.warn(
                  `Error deleting entry with id: ${deliverable.sys.id}`,
                );
              }
            } catch {
              logger.warn(
                `Error unpublishing entry with id: ${deliverable.sys.id}`,
              );
            }
          } catch {
            logger.warn(`Error fetching entry with id: ${deliverable.sys.id}`);
          }
        },
      ),
    );

    const publishedDeliverables = await Promise.all(
      update.deliverables.map(async (deliverable) => {
        try {
          const entry = await environment.createEntry(
            'workingGroupDeliverables',
            {
              fields: addLocaleToFields(deliverable),
            },
          );
          return entry.publish();
        } catch (e) {
          throw new Error(`Error creating deliverable: ${e}`);
        }
      }),
    );

    const deliverables = publishedDeliverables.map((deliverable) => ({
      sys: {
        type: 'Link',
        linkType: 'Entry',
        id: deliverable.sys.id,
      },
    }));

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
    lastUpdated,
    tagsCollection,
    linkedFrom,
  } = item;

  const deliverables = (deliverablesCollection?.items || [])
    .filter((x): x is WorkingGroupDeliverable => x !== null)
    .map((deliverable) => ({
      // these two fields are required in Contentful they can't be null
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      status: deliverable.status!,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      description: deliverable.description!,
    }))
    .map(mapDeliverables(!!complete));

  const getUserFromMemberCollection = (member: MemberItem) => ({
    id: member.user?.sys.id || '',
    firstName: member.user?.firstName || '',
    lastName: member.user?.lastName || '',
    displayName: parseUserDisplayName(
      member.user?.firstName || '',
      member.user?.lastName || '',
      undefined,
      member.user?.nickname || '',
    ),
    alumniSinceDate: member.user?.alumniSinceDate,
    email: member.user?.email || '',
    avatarUrl: member.user?.avatar?.url || undefined,
    teams: parseTeamsCollection(member.user?.teamsCollection),
  });

  const leaders = (membersCollection?.items || [])
    .map((member) => {
      if (member?.__typename === 'WorkingGroupLeaders') {
        return {
          role: member.role as WorkingGroupRole,
          workstreamRole: member.workstreamRole || '',
          inactiveSinceDate: member.inactiveSinceDate,
          user: getUserFromMemberCollection(member),
        } as WorkingGroupLeader;
      }
      return null;
    })
    .filter((x): x is WorkingGroupLeader => x !== null);

  const members = (membersCollection?.items || [])
    .map((member) => {
      if (member?.__typename === 'WorkingGroupMembers') {
        return {
          inactiveSinceDate: member.inactiveSinceDate,
          user: getUserFromMemberCollection(member),
        } as WorkingGroupMember;
      }
      return null;
    })
    .filter((x): x is WorkingGroupMember => x !== null);

  const workingGroup = {
    id: sys.id,
    title: title || '',
    description: description
      ? parseRichText(description as RichTextFromQuery)
      : '',
    lastModifiedDate: lastUpdated,
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
    tags:
      tagsCollection?.items.map((tag) => tag?.name || '').filter(Boolean) || [],
    researchOutputsIds:
      cleanArray(linkedFrom?.researchOutputsCollection?.items)
        .map((researchOutput) => researchOutput?.sys.id)
        .filter((id): id is string => id !== null) || [],
  };

  return externalLink ? { ...workingGroup, externalLink } : workingGroup;
};
