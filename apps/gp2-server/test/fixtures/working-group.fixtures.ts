import type {
  ContentfulWebhookPayload,
  gp2 as gp2Contentful,
} from '@asap-hub/contentful';
import type { gp2 as gp2Model, WebhookDetail } from '@asap-hub/model';
import { EventBridgeEvent } from 'aws-lambda';
import { createEventBridgeEventMock } from '../helpers/events';
import { getContentfulTagsCollectionGraphqlResponse } from './tag.fixtures';

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
        displayName: 'Tony Stark',
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
    tags: [{ id: '42', name: 'tag-1' }],
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

export const getWorkingGroupResponse = (
  overrides: Partial<gp2Model.WorkingGroupResponse> = {},
): gp2Model.WorkingGroupResponse => ({
  ...getWorkingGroupDataObject(),
  ...overrides,
});

export const createWorkingGroupMembersResponse = (
  length = 1,
): gp2Model.WorkingGroupMember[] =>
  Array.from({ length }, (_, id) => ({
    userId: String(id),
    firstName: 'Tony',
    lastName: 'Stark',
    displayName: 'Tony Stark',
    role: 'Lead',
  }));

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
        nickname: null,
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
  tagsCollection: { ...getContentfulTagsCollectionGraphqlResponse() },
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

export const getWorkingGroupWebhookPayload = (
  id: string,
): WebhookDetail<ContentfulWebhookPayload<'workingGroup'>> => ({
  resourceId: id,
  metadata: {
    tags: [],
  },
  sys: {
    type: 'Entry',
    id: 'fc496d00-053f-44fd-9bac-68dd9d959848',
    space: {
      sys: {
        type: 'Link',
        linkType: 'Space',
        id: '5v6w5j61tndm',
      },
    },
    environment: {
      sys: {
        id: 'an-environment',
        type: 'Link',
        linkType: 'Environment',
      },
    },
    contentType: {
      sys: {
        type: 'Link',
        linkType: 'ContentType',
        id: 'workingGroup',
      },
    },
    createdBy: {
      sys: {
        type: 'Link',
        linkType: 'User',
        id: '3ZHvngTJ24kxZUAPDJ8J1z',
      },
    },
    updatedBy: {
      sys: {
        type: 'Link',
        linkType: 'User',
        id: '3ZHvngTJ24kxZUAPDJ8J1z',
      },
    },
    revision: 14,
    createdAt: '2023-05-17T13:39:03.250Z',
    updatedAt: '2023-05-18T16:17:36.425Z',
  },
  fields: {
    title: {
      'en-US':
        'Sci 7 - Inflammation & Immune Reg., Presenting Teams: Sulzer, Desjardins, Kordower',
    },
  },
});

export const getWorkingGroupEvent = (
  id: string,
  eventType: gp2Model.WorkingGroupEvent,
): EventBridgeEvent<
  gp2Model.WorkingGroupEvent,
  WebhookDetail<ContentfulWebhookPayload<'workingGroup'>>
> =>
  createEventBridgeEventMock(getWorkingGroupWebhookPayload(id), eventType, id);
