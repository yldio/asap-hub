import type {
  ContentfulWebhookPayload,
  gp2 as gp2Contentful,
} from '@asap-hub/contentful';
import { gp2 as gp2Model, ListResponse, WebhookDetail } from '@asap-hub/model';
import { EventBridgeEvent } from 'aws-lambda';
import {
  OutputCreateData,
  OutputUpdateData,
} from '../../src/controllers/output.controller';
import { createEventBridgeEventMock } from '../helpers/events';

export const getOutputDataObject = (): gp2Model.OutputDataObject => ({
  id: 'ec3086d4-aa64-4f30-a0f7-5c5b95ffbcca',
  created: '2020-09-23T16:34:26.842Z',
  documentType: 'Article',
  type: 'Research',
  addedDate: '2021-05-21T13:18:31.000Z',
  title: 'Test Proposal 1234',
  link: 'http://a.link',
  description: 'A nice article',
  sharingStatus: 'GP2 Only',
  authors: [
    {
      id: 'user-id-1',
      firstName: 'Tony',
      lastName: 'Stark',
      email: 'tony.stark@email.com',
      displayName: 'Tony Stark',
      onboarded: true,
    },
    {
      id: 'user-id-2',
      firstName: 'Peter',
      lastName: 'Parker',
      displayName: 'Peter Parker',
      email: 'peter.parker@email.com',
      onboarded: true,
    },
  ],
  publishDate: '2021-05-21T13:18:31.000Z',
  lastUpdatedPartial: '2020-09-23T16:34:26.842Z',
  subtype: 'Published',
  projects: [
    {
      id: '42',
      title: 'A Project',
    },
  ],
  relatedOutputs: [
    {
      id: 'another-output-id',
      title: 'another title',
      documentType: 'Dataset',
    },
  ],
  tags: [{ id: 'tag-1', name: 'Cohort' }],
  contributingCohorts: [{ id: 'cohort-1', name: 'Cohort' }],
  mainEntity: {
    id: '42',
    title: 'A Project',
    type: 'Projects',
  },
});

export const getListOutputDataObject =
  (): ListResponse<gp2Model.OutputDataObject> => ({
    total: 1,
    items: [getOutputDataObject()],
  });

export const getOutputResponse = (): gp2Model.OutputResponse =>
  getOutputDataObject();

export const getListOutputResponse = (): gp2Model.ListOutputResponse => ({
  total: 1,
  items: [getOutputResponse()],
});

export const getOutputPostRequest = (): gp2Model.OutputPostRequest => {
  const {
    id: _,
    created: _created,
    lastUpdatedPartial: _lastUpdatedPartial,
    addedDate: _addedDate,
    authors,
    workingGroups,
    projects,
    mainEntity,
    ...outputResponse
  } = getOutputResponse();
  return {
    ...outputResponse,
    link: 'http://a.link',
    type: 'Research',
    projectIds: projects?.map(({ id }) => id),
    authors: authors.map(({ id }) => ({ userId: id })),
    mainEntityId: mainEntity.id,
  };
};

export const getOutputPutRequest = (): gp2Model.OutputPutRequest => {
  return getOutputPostRequest();
};

export const getOutputCreateData = (): OutputCreateData => ({
  ...getOutputPostRequest(),
  createdBy: 'userId',
});

export const getOutputCreateDataObject =
  (): gp2Model.OutputCreateDataObject => {
    const {
      authors,
      id: _id,
      lastUpdatedPartial: _lastUpdatedPartial,
      created: _created,
      workingGroups,
      projects,
      mainEntity,
      ...outputPostRequest
    } = getOutputResponse();

    return {
      ...outputPostRequest,
      createdBy: 'userId',
      projectIds: projects?.map(({ id }) => id),
      authors: authors.map(({ id }) => ({ userId: id })),
    };
  };

export const getOutputUpdateDataObject =
  (): gp2Model.OutputUpdateDataObject => {
    const { createdBy: _, ...outputCreateDataObject } =
      getOutputCreateDataObject();

    return {
      ...outputCreateDataObject,
      updatedBy: 'userId',
    };
  };

export const getOutputUpdateData = (): OutputUpdateData => ({
  ...getOutputPutRequest(),
  updatedBy: 'userId',
});

export const getContentfulGraphqlOutput = (): NonNullable<
  NonNullable<gp2Contentful.FetchOutputByIdQuery['outputs']>
> => ({
  sys: {
    id: 'ec3086d4-aa64-4f30-a0f7-5c5b95ffbcca',
    firstPublishedAt: '2020-09-23T16:34:26.842Z',
    publishedAt: '2023-05-30T11:07:50.172Z',
    publishedVersion: 12,
  },
  title: 'Test Proposal 1234',
  documentType: 'Article',
  type: 'Research',
  subtype: 'Published',
  description: 'A nice article',
  link: 'http://a.link',
  addedDate: '2021-05-21T13:18:31.000Z',
  publishDate: '2021-05-21T13:18:31.000Z',
  lastUpdatedPartial: '2020-09-23T16:34:26.842Z',
  relatedEntitiesCollection: {
    total: 1,
    items: [
      {
        __typename: 'Projects',
        sys: {
          id: '42',
        },
        title: 'A Project',
      },
    ],
  },
  authorsCollection: {
    total: 2,
    items: [
      {
        __typename: 'Users',
        sys: {
          id: 'user-id-1',
        },
        firstName: 'Tony',
        lastName: 'Stark',
        email: 'tony.stark@email.com',
        avatar: null,
        onboarded: true,
      },
      {
        __typename: 'Users',
        sys: {
          id: 'user-id-2',
        },
        firstName: 'Peter',
        lastName: 'Parker',
        email: 'peter.parker@email.com',
        avatar: null,
        onboarded: true,
      },
    ],
  },
  tagsCollection: {
    total: 1,
    items: [
      {
        sys: {
          id: 'tag-1',
        },
        name: 'Cohort',
      },
    ],
  },
  relatedOutputsCollection: {
    total: 1,
    items: [
      {
        sys: { id: 'another-output-id' },
        title: 'another title',
        documentType: 'Dataset',
      },
    ],
  },
  contributingCohortsCollection: {
    total: 1,
    items: [
      {
        sys: {
          id: 'cohort-1',
        },
        name: 'Cohort',
      },
    ],
  },
});

export const getContentfulOutputsGraphqlResponse =
  (): gp2Contentful.FetchOutputsQuery => ({
    outputsCollection: {
      total: 1,
      items: [getContentfulGraphqlOutput()],
    },
  });

export const getOutputWebhookPayload = (
  id: string,
): WebhookDetail<ContentfulWebhookPayload<'output'>> => ({
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
        id: 'output',
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

export const getOutputEvent = (
  id: string,
  eventType: gp2Model.OutputEvent,
): EventBridgeEvent<
  gp2Model.OutputEvent,
  WebhookDetail<ContentfulWebhookPayload<'output'>>
> => createEventBridgeEventMock(getOutputWebhookPayload(id), eventType, id);
