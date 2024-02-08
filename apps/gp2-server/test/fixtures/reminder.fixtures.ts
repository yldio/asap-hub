import { gp2 as gp2Contentful } from '@asap-hub/contentful';
import { gp2 as gp2Model } from '@asap-hub/model';
import { getOutputDataObject } from './output.fixtures';

export const getOutputPublishedReminder =
  (): gp2Model.OutputPublishedReminder => {
    const outputDataObject = getOutputDataObject();
    return {
      id: 'output-published-ec3086d4-aa64-4f30-a0f7-5c5b95ffbcca',
      entity: 'Output',
      type: 'Published',
      data: {
        outputId: outputDataObject.id,
        documentType: outputDataObject.documentType,
        title: outputDataObject.title,
        addedDate: outputDataObject.addedDate,
        statusChangedBy: 'Tony Stark',
        associationType: 'project',
        associationName: 'Sample Prioritization',
      },
    };
  };

export const getOutputVersionPublishedReminder =
  (): gp2Model.OutputVersionPublishedReminder => {
    const outputDataObject = getOutputDataObject();
    return {
      id: 'output-version-published-ec3086d4-aa64-4f30-a0f7-5c5b95ffbcca',
      entity: 'Output Version',
      type: 'Published',
      data: {
        outputId: outputDataObject.id,
        documentType: outputDataObject.documentType,
        title: outputDataObject.title,
        publishedAt: outputDataObject.addedDate,
        associationType: 'project',
        associationName: 'Sample Prioritization',
      },
    };
  };

export const getReminderOutputCollectionItem = (): NonNullable<
  gp2Contentful.FetchRemindersQuery['outputsCollection']
>['items'][number] => {
  const outputDataObject = getOutputDataObject();

  return {
    sys: {
      id: outputDataObject.id,
    },
    title: outputDataObject.title,
    documentType: outputDataObject.documentType,
    createdBy: {
      firstName: 'Tony',
      lastName: 'Stark',
    },
    relatedEntitiesCollection: {
      items: [
        {
          __typename: 'Projects',
          sys: {
            id: 'Project-1',
          },
          title: 'Sample Prioritization',
        },
        {
          __typename: 'WorkingGroups',
          sys: {
            id: 'WG-1',
          },
          title: 'Data and Code Dissemination',
        },
      ],
    },
  };
};

export const getReminderOutputVersionCollectionItem = (): NonNullable<
  gp2Contentful.FetchRemindersQuery['outputVersionCollection']
>['items'][number] => {
  return {
    sys: {
      id: 'ec3086d4-aa64-4f30-a0f7-5c5b95ffbcca',
      publishedAt: '2020-09-23T16:34:26.842Z',
    },
    linkedFrom: {
      outputsCollection: {
        items: [
          {
            title: 'test-output-version',
            documentType: 'Article',
            sys: {
              id: 'output-1',
            },
            createdBy: {
              firstName: 'Tony',
              lastName: 'Stark',
            },
            relatedEntitiesCollection: {
              items: [
                {
                  __typename: 'Projects',
                  sys: {
                    id: 'Project-1',
                  },
                  title: 'Sample Prioritization',
                },
                {
                  __typename: 'WorkingGroups',
                  sys: {
                    id: 'WG-1',
                  },
                  title: 'Data and Code Dissemination',
                },
              ],
            },
          },
        ],
      },
    },
  };
};

export const getReminderUsersContent =
  (): gp2Contentful.FetchRemindersQuery['users'] => ({
    linkedFrom: {
      workingGroupMembershipCollection: {
        items: [
          {
            linkedFrom: {
              workingGroupsCollection: {
                items: [
                  {
                    sys: {
                      id: 'WG-1',
                    },
                  },
                ],
              },
            },
          },
          {
            linkedFrom: {
              workingGroupsCollection: {
                items: [
                  {
                    sys: {
                      id: 'WG-2',
                    },
                  },
                ],
              },
            },
          },
        ],
      },
      projectMembershipCollection: {
        items: [
          {
            linkedFrom: {
              projectsCollection: {
                items: [
                  {
                    sys: {
                      id: 'Project-1',
                    },
                  },
                ],
              },
            },
          },
        ],
      },
    },
  });

export const getOutputPublishedReminderResponse =
  (): gp2Model.ReminderResponse => {
    return {
      id: 'output-published-ec3086d4-aa64-4f30-a0f7-5c5b95ffbcca',
      description:
        '**Tony Stark** in project **Sample Prioritization** published a **Article** output: "Test Proposal 1234".',
      entity: 'Output',
      href: '/outputs/ec3086d4-aa64-4f30-a0f7-5c5b95ffbcca',
    };
  };

export const getOutputVersionPublishedReminderResponse =
  (): gp2Model.ReminderResponse => {
    return {
      id: 'output-version-published-ec3086d4-aa64-4f30-a0f7-5c5b95ffbcca',
      description:
        'Project **Sample Prioritization** published a new project **article** output version: "Test Proposal 1234".',
      entity: 'Output Version',
      href: '/outputs/ec3086d4-aa64-4f30-a0f7-5c5b95ffbcca',
    };
  };

export const getListReminderResponse = (): gp2Model.ListReminderResponse => ({
  total: 2,
  items: [
    getOutputPublishedReminderResponse(),
    getOutputVersionPublishedReminderResponse(),
  ],
});
