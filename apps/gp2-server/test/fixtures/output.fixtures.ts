import type { gp2 as gp2Contentful } from '@asap-hub/contentful';
import { gp2 as gp2Model, ListResponse } from '@asap-hub/model';
import {
  OutputCreateData,
  OutputUpdateData,
} from '../../src/controllers/output.controller';

export const getOutputDataObject = (): gp2Model.OutputDataObject => ({
  id: 'ec3086d4-aa64-4f30-a0f7-5c5b95ffbcca',
  created: '2020-09-23T16:34:26.842Z',
  documentType: 'Article',
  type: 'Research',
  addedDate: '2021-05-21T13:18:31.000Z',
  title: 'Test Proposal 1234',
  link: 'http://a.link',
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
  project: {
    id: '42',
    title: 'A Project',
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
    workingGroup,
    project,
    ...outputResponse
  } = getOutputResponse();
  return {
    ...outputResponse,
    link: 'http://a.link',
    type: 'Research',
    project: project?.id,
    authors: authors.map(({ id }) => ({ userId: id })),
  };
};

export const getOutputPutRequest = (): gp2Model.OutputPutRequest => {
  const { project, ...data } = getOutputPostRequest();
  return data;
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
      workingGroup,
      project,
      ...outputPostRequest
    } = getOutputResponse();

    return {
      ...outputPostRequest,
      createdBy: 'userId',
      project: project?.id,
      authors: authors.map(({ id }) => ({ userId: id })),
    };
  };

export const getOutputUpdateDataObject =
  (): gp2Model.OutputUpdateDataObject => {
    const {
      createdBy: _,
      project: __,
      ...outputCreateDataObject
    } = getOutputCreateDataObject();

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
  link: 'http://a.link',
  addedDate: '2021-05-21T13:18:31.000Z',
  publishDate: '2021-05-21T13:18:31.000Z',
  lastUpdatedPartial: '2020-09-23T16:34:26.842Z',
  relatedEntity: {
    __typename: 'Projects',
    sys: {
      id: '42',
    },
    title: 'A Project',
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
});

export const getContentfulOutputsGraphqlResponse =
  (): gp2Contentful.FetchOutputsQuery => ({
    outputsCollection: {
      total: 1,
      items: [getContentfulGraphqlOutput()],
    },
  });
