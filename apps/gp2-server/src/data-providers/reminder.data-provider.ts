import { GraphQLClient, gp2 as gp2Contentful } from '@asap-hub/contentful';

import { FetchRemindersOptions, gp2 as gp2Model } from '@asap-hub/model';
import {
  cleanArray,
  getReferenceDates,
  getUserName,
  inLast24Hours,
  filterUndefined,
} from '@asap-hub/server-common';
import { DateTime } from 'luxon';
import { ReminderDataProvider } from './types';

type OutputItem = NonNullable<
  NonNullable<
    gp2Contentful.FetchRemindersQuery['outputsCollection']
  >['items'][number]
>;

type OutputVersionItem = NonNullable<
  NonNullable<
    gp2Contentful.FetchRemindersQuery['outputVersionCollection']
  >['items'][number]
>;

export class ReminderContentfulDataProvider implements ReminderDataProvider {
  constructor(private contentfulClient: GraphQLClient) {}

  async fetchById(): Promise<null> {
    throw new Error('Method not implemented.');
  }

  async fetch(
    options: FetchRemindersOptions,
  ): Promise<gp2Model.ListReminderDataObject> {
    const { timezone, userId } = options;

    const outputFilter = getOutputFilter(timezone);
    const outputVersionFilter = getOutputVersionFilter(timezone);

    const { outputsCollection, outputVersionCollection, users } =
      await this.contentfulClient.request<
        gp2Contentful.FetchRemindersQuery,
        gp2Contentful.FetchRemindersQueryVariables
      >(gp2Contentful.FETCH_REMINDERS, {
        outputFilter,
        outputVersionFilter,
        userId,
      });

    const userProjectIds = getUserProjectIds(users);
    const userWorkingGroupIds = getUserWorkingGroupIds(users);

    const outputsCollectionItems = cleanArray(outputsCollection?.items);
    const outputVersionItems = cleanArray(outputVersionCollection?.items);

    const publishedOutputReminders = getPublishedOutputRemindersFromQuery(
      outputsCollectionItems,
      userProjectIds,
      userWorkingGroupIds,
      timezone,
    );

    const publishedOutputVersionReminders =
      getPublishedOutputVersionRemindersFromQuery(
        outputVersionItems,
        userProjectIds,
        userWorkingGroupIds,
        timezone,
      );

    const versionReminderIds = publishedOutputVersionReminders.map(
      (reminder) => reminder.data.outputId,
    );

    const reminders = [
      ...publishedOutputReminders.filter(
        (reminder) => !versionReminderIds.includes(reminder.data.outputId),
      ),
      ...publishedOutputVersionReminders,
    ];

    const sortedReminders = reminders.sort((reminderA, reminderB) => {
      const aStartDate = getSortDate(reminderA);
      const bStartDate = getSortDate(reminderB);

      return bStartDate.diff(aStartDate).as('seconds');
    });

    return {
      total: sortedReminders.length,
      items: sortedReminders,
    };
  }
}

const getPublishedOutputRemindersFromQuery = (
  outputsCollectionItems: OutputItem[],
  userProjectIds: string[],
  userWorkingGroupIds: string[],
  zone: string,
): gp2Model.OutputPublishedReminder[] => {
  if (
    !outputsCollectionItems.length ||
    (userProjectIds.length === 0 && userWorkingGroupIds.length === 0)
  ) {
    return [];
  }

  return outputsCollectionItems.reduce<gp2Model.OutputPublishedReminder[]>(
    (outputReminders, output) => {
      if (
        !output.title ||
        !output.documentType ||
        !gp2Model.isOutputDocumentType(output.documentType) ||
        !inLast24Hours(output.addedDate, zone)
      )
        return outputReminders;

      const { associationName, associationType } =
        getAssociationNameAndType(output);
      const userName = getUserName(output);

      const outputEntityIds = (output?.relatedEntitiesCollection?.items || [])
        .filter((relatedEntityItem) => relatedEntityItem?.sys.id !== undefined)
        .map((relatedEntityItem) => relatedEntityItem?.sys.id as string);

      const isInProject = outputEntityIds.some((id) =>
        userProjectIds.includes(id),
      );

      const isInWorkingGroup = outputEntityIds.some((id) =>
        userWorkingGroupIds.includes(id),
      );
      if (
        associationName &&
        associationType &&
        userName &&
        ((associationType === 'project' && isInProject) ||
          (associationType === 'working group' && isInWorkingGroup))
      ) {
        outputReminders.push({
          id: `output-published-${output.sys.id}`,
          entity: 'Output',
          type: 'Published',
          data: {
            outputId: output.sys.id,
            documentType: output.documentType,
            title: output.title,
            addedDate: output.addedDate,
            statusChangedBy: userName,
            associationType,
            associationName,
          },
        });
      }

      return outputReminders;
    },
    [],
  );
};

const getPublishedOutputVersionRemindersFromQuery = (
  outputVersionCollectionItems: OutputVersionItem[],
  userProjectIds: string[],
  userWorkingGroupIds: string[],
  zone: string,
): gp2Model.OutputVersionPublishedReminder[] => {
  if (
    !outputVersionCollectionItems.length ||
    (userProjectIds.length === 0 && userWorkingGroupIds.length === 0)
  ) {
    return [];
  }

  outputVersionCollectionItems.sort((reminderA, reminderB) => {
    const aStartDate = DateTime.fromISO(reminderA.sys.publishedAt);
    const bStartDate = DateTime.fromISO(reminderB.sys.publishedAt);

    return bStartDate.diff(aStartDate).as('seconds');
  });

  const seenOutputList: string[] = [];

  return outputVersionCollectionItems.reduce<
    gp2Model.OutputVersionPublishedReminder[]
  >((outputVersionReminders, outputVersion) => {
    const isPublished = !!outputVersion.sys.publishedAt;
    const output = cleanArray(
      outputVersion.linkedFrom?.outputsCollection?.items,
    )[0];

    if (
      !output ||
      !output.title ||
      !output.documentType ||
      !gp2Model.isOutputDocumentType(output.documentType) ||
      !isPublished ||
      !inLast24Hours(outputVersion.sys.publishedAt, zone) ||
      seenOutputList.includes(output.sys.id)
    )
      return outputVersionReminders;

    const { associationName, associationType } =
      getAssociationNameAndType(output);
    const userName = getUserName(output);

    const outputEntityIds = (output?.relatedEntitiesCollection?.items || [])
      .filter((relatedEntityItem) => relatedEntityItem?.sys.id !== undefined)
      .map((relatedEntityItem) => relatedEntityItem?.sys.id as string);

    const isInProject = outputEntityIds.some((id) =>
      userProjectIds.includes(id),
    );

    const isInWorkingGroup = outputEntityIds.some((id) =>
      userWorkingGroupIds.includes(id),
    );
    if (
      associationName &&
      associationType &&
      userName &&
      ((associationType === 'project' && isInProject) ||
        (associationType === 'working group' && isInWorkingGroup))
    ) {
      seenOutputList.push(output.sys.id);
      outputVersionReminders.push({
        id: `output-version-published-${outputVersion.sys.id}`,
        entity: 'Output Version',
        type: 'Published',
        data: {
          outputId: output.sys.id,
          documentType: output.documentType,
          title: output.title,
          publishedAt: outputVersion.sys.publishedAt,
          statusChangedBy: userName,
          associationType,
          associationName,
        },
      });
    }

    return outputVersionReminders;
  }, []);
};

export const getSortDate = (
  reminder: gp2Model.ReminderDataObject,
): DateTime => {
  if (reminder.entity === 'Output') {
    return DateTime.fromISO(reminder.data.addedDate);
  }
  return DateTime.fromISO(reminder.data.publishedAt);
};

export const getOutputFilter = (zone: string): gp2Contentful.OutputsFilter => {
  const { last24HoursISO } = getReferenceDates(zone);
  return {
    AND: [
      { addedDate_gte: last24HoursISO },
      { sys: { publishedVersion_exists: true } },
    ],
  };
};

export const getOutputVersionFilter = (
  zone: string,
): gp2Contentful.OutputVersionFilter => {
  const { last24HoursISO } = getReferenceDates(zone);
  return { sys: { publishedAt_gte: last24HoursISO } };
};

export const getUserProjectIds = (
  users: gp2Contentful.FetchRemindersQuery['users'],
) =>
  filterUndefined(
    users?.linkedFrom?.projectMembershipCollection?.items.flatMap(
      (projectMembership) =>
        projectMembership?.linkedFrom?.projectsCollection?.items.map(
          (project) => project?.sys.id,
        ),
    ) || [],
  );
export const getUserWorkingGroupIds = (
  users: gp2Contentful.FetchRemindersQuery['users'],
) =>
  filterUndefined(
    users?.linkedFrom?.workingGroupMembershipCollection?.items.flatMap(
      (workingGroupMembership) =>
        workingGroupMembership?.linkedFrom?.workingGroupsCollection?.items.map(
          (workingGroup) => workingGroup?.sys.id,
        ),
    ) || [],
  );

const getAssociationNameAndType = (
  output: OutputItem,
): {
  associationType: 'project' | 'working group' | null;
  associationName: string | null;
} => {
  const association = output.relatedEntitiesCollection?.items[0];

  return association && association.__typename && association.title
    ? {
        associationType:
          association.__typename === 'Projects' ? 'project' : 'working group',
        associationName: association.title,
      }
    : {
        associationType: null,
        associationName: null,
      };
};
