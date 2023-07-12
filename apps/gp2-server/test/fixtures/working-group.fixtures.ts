import type { gp2 as gp2Contentful } from '@asap-hub/contentful';
import type { gp2 as gp2Model } from '@asap-hub/model';

export const getWorkingGroupDataObject =
  (): gp2Model.WorkingGroupDataObject => ({
    id: '11',
    title: 'a working group title',
    shortDescription: 'Short description',
    description: '<p>longer description</p>',
    primaryEmail: 'primary.email@example.com',
    secondaryEmail: 'secondary.email@example.com',
    leadingMembers: 'Leading members',
    members: [
      {
        id: '32',
        userId: '11',
        firstName: 'Tony',
        lastName: 'Stark',
        role: 'Lead',
      },
    ],
    milestones: [
      {
        title: 'A working group milestone',
        status: 'Active',
      },
    ],
    resources: [
      {
        id: '27',
        type: 'Note',
        description: 'Working group resource description',
        title: 'Working group resource title',
      },
    ],
    calendar: {
      id: '42',
      name: 'working group calendar',
    },
  });

export const getWorkingGroupUpdateDataObject =
  (): gp2Model.WorkingGroupUpdateDataObject => ({
    resources: [
      {
        type: 'Note',
        description: 'Working group resource description',
        title: 'Working group resource title',
      },
    ],
    members: [
      {
        userId: '11',
        role: 'Lead',
      },
    ],
  });

export const getListWorkingGroupDataObject =
  (): gp2Model.ListWorkingGroupResponse => ({
    total: 1,
    items: [getWorkingGroupDataObject()],
  });

export const getWorkingGroupResponse = (): gp2Model.WorkingGroupResponse =>
  getWorkingGroupDataObject();

export const getListWorkingGroupsResponse =
  (): gp2Model.ListWorkingGroupResponse => ({
    total: 1,
    items: [getWorkingGroupResponse()],
  });

export const getContentfulGraphqlWorkingGroupMembers = () => ({
  total: 1,
  items: [
    {
      sys: {
        id: '32',
      },
      role: 'Lead',
      user: {
        sys: {
          id: '11',
        },
        firstName: 'Tony',
        lastName: 'Stark',
        onboarded: true,
      },
    },
  ],
});
export const getContentfulGraphqlWorkingGroupMilestones = () => ({
  total: 1,
  items: [
    {
      sys: {
        id: '23',
      },
      status: 'Active',
      title: 'A working group milestone',
    },
  ],
});

export const getContentfulGraphqlWorkingGroupResources = () => ({
  total: 1,
  items: [
    {
      sys: {
        id: '27',
      },
      type: 'Note',
      title: 'Working group resource title',
      description: 'Working group resource description',
      externalLink: 'http://example/link',
    },
  ],
});
export const getContentfulGraphqlWorkingGroup = (
  props = {},
): NonNullable<
  NonNullable<gp2Contentful.FetchWorkingGroupByIdQuery['workingGroups']>
> => ({
  sys: {
    id: '11',
  },
  title: 'a working group title',
  shortDescription: 'Short description',
  description: {
    json: {
      nodeType: 'document',
      data: {},
      content: [
        {
          nodeType: 'paragraph',
          data: {},
          content: [
            {
              nodeType: 'text',
              value: 'longer description',
              marks: [],
              data: {},
            },
          ],
        },
      ],
    },
  },
  primaryEmail: 'primary.email@example.com',
  secondaryEmail: 'secondary.email@example.com',
  leadingMembers: 'Leading members',
  membersCollection: { ...getContentfulGraphqlWorkingGroupMembers() },
  milestonesCollection: { ...getContentfulGraphqlWorkingGroupMilestones() },
  resourcesCollection: { ...getContentfulGraphqlWorkingGroupResources() },
  calendar: {
    sys: {
      id: '42',
    },
    name: 'working group calendar',
  },
  ...props,
});

export const getContentfulGraphqlWorkingGroupsResponse =
  (): gp2Contentful.FetchWorkingGroupsQuery => ({
    workingGroupsCollection: {
      total: 1,
      items: [getContentfulGraphqlWorkingGroup()],
    },
  });
