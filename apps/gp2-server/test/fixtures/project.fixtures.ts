import type {
  ContentfulWebhookPayload,
  gp2 as gp2Contentful,
} from '@asap-hub/contentful';
import { gp2 as gp2Model, WebhookDetail } from '@asap-hub/model';
import { EventBridgeEvent } from 'aws-lambda';
import { createEventBridgeEventMock } from '../helpers/events';

export const getProjectDataObject = (): gp2Model.ProjectDataObject => ({
  id: '7',
  title: 'a project title',
  startDate: '2020-07-06',
  endDate: '2021-12-28',
  status: 'Completed',
  projectProposalUrl: 'http://a-proposal',
  members: [
    {
      id: '32',
      userId: '11',
      firstName: 'Tony',
      lastName: 'Stark',
      role: 'Project manager',
    },
  ],
  tags: [{ id: '1', name: 'BLAAC-PD' }],
  description: 'test description',
  leadEmail: 'peter@parker.com',
  pmEmail: 'tony@stark.com',
  milestones: [
    {
      title: 'A project milestone',
      status: 'Active',
    },
  ],
  resources: [
    {
      id: '27',
      type: 'Note',
      description: 'Project resource description',
      title: 'Project resource title',
    },
  ],
  traineeProject: false,
  opportunitiesLink: 'http://opportunities',
  calendar: { id: '42', name: 'project calendar' },
});
export const getProjectUpdateDataObject =
  (): gp2Model.ProjectUpdateDataObject => ({
    resources: [
      {
        type: 'Note',
        description: 'Project resource description',
        title: 'Project resource title',
      },
    ],
    members: [
      {
        userId: '11',
        role: 'Project manager',
      },
    ],
    tags: [{ id: '34' }],
  });

export const getListProjectDataObject = (): gp2Model.ListProjectDataObject => ({
  total: 1,
  items: [getProjectDataObject()],
});

export const getProjectResponse = (): gp2Model.ProjectResponse => ({
  ...getProjectDataObject(),
  _tags: [gp2Model.opportunitiesAvailable],
});

export const getListProjectsResponse = (): gp2Model.ListProjectResponse => ({
  total: 1,
  items: [getProjectResponse()],
});

export const getContentfulGraphqlProjectMembers = () => ({
  total: 1,
  items: [
    {
      sys: {
        id: '32',
      },
      role: 'Project manager',
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
export const getContentfulGraphqlProjectMilestones = () => ({
  total: 1,
  items: [
    {
      sys: {
        id: '23',
      },
      status: 'Active',
      title: 'A project milestone',
    },
  ],
});

export const getContentfulGraphqlProjectResources = () => ({
  total: 1,
  items: [
    {
      sys: {
        id: '27',
      },
      type: 'Note',
      title: 'Project resource title',
      description: 'Project resource description',
      externalLink: 'http://example/link',
    },
  ],
});

export const getContentfulGraphqlProjectTags = () => ({
  total: 1,
  items: [
    {
      sys: {
        id: '1',
      },
      name: 'BLAAC-PD',
    },
  ],
});
export const getContentfulGraphqlProject = (
  props = {},
): NonNullable<
  NonNullable<gp2Contentful.FetchProjectByIdQuery['projects']>
> => ({
  sys: {
    id: '7',
  },
  title: 'a project title',
  startDate: '2020-07-06',
  endDate: '2021-12-28',
  status: 'Completed',
  projectProposal: 'http://a-proposal',
  tagsCollection: { ...getContentfulGraphqlProjectTags() },
  description: 'test description',
  leadEmail: 'peter@parker.com',
  pmEmail: 'tony@stark.com',
  traineeProject: false,
  opportunitiesLink: 'http://opportunities',
  membersCollection: { ...getContentfulGraphqlProjectMembers() },
  milestonesCollection: { ...getContentfulGraphqlProjectMilestones() },
  resourcesCollection: { ...getContentfulGraphqlProjectResources() },
  calendar: {
    sys: {
      id: '42',
    },
    name: 'project calendar',
  },
  ...props,
});

export const getContentfulGraphqlProjectsResponse =
  (): gp2Contentful.FetchProjectsQuery => ({
    projectsCollection: {
      total: 1,
      items: [getContentfulGraphqlProject()],
    },
  });

export const getProjectWebhookPayload = (
  id: string,
): WebhookDetail<ContentfulWebhookPayload<'project'>> => ({
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
        id: 'project',
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

export const getProjectEvent = (
  id: string,
  eventType: gp2Model.ProjectEvent,
): EventBridgeEvent<
  gp2Model.ProjectEvent,
  WebhookDetail<ContentfulWebhookPayload<'project'>>
> => createEventBridgeEventMock(getProjectWebhookPayload(id), eventType, id);
