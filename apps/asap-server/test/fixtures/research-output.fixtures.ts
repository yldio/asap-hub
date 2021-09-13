import {
  ListResearchOutputResponse,
  ListUserResponse,
  ResearchOutputResponse,
} from '@asap-hub/model';
import {
  GraphqlResearchOutputAuthors,
  GraphqlResearchOutput,
  GraphqlUserAssoc,
  WebhookPayload,
  ResearchOutput,
} from '@asap-hub/squidex';
import { Rest } from '@asap-hub/squidex/src/entities/common';
import {
  ResponseFetchResearchOutput,
  ResponseFetchResearchOutputs,
} from '../../src/controllers/research-outputs';
import { DeepWriteable } from '../../src/utils/types';
import { fetchExpectation, graphQlResponseFetchUsers } from './users.fixtures';

export const getSquidexResearchOutputsGraphqlResponse =
  (): ResponseFetchResearchOutputs => ({
    queryResearchOutputsContentsWithTotal: {
      total: 1,
      items: [getSquidexGraphqlResearchOutput()],
    },
  });

export const getSquidexResearchOutputGraphqlResponseAuthors =
  (): GraphqlResearchOutputAuthors[] =>
    graphQlResponseFetchUsers.data.queryUsersContentsWithTotal.items.map(
      (item): GraphqlUserAssoc => ({
        __typename: 'Users',
        ...item,
      }),
    );

export const getSquidexResearchOutputGraphqlResponse =
  (): ResponseFetchResearchOutput => ({
    findResearchOutputsContent: getSquidexGraphqlResearchOutput(),
  });

export const getSquidexGraphqlResearchOutput = (): GraphqlResearchOutput => ({
  id: 'ec3086d4-aa64-4f30-a0f7-5c5b95ffbcca',
  created: '2020-09-23T16:34:26.842Z',
  lastModified: '2021-05-14T14:48:46Z',
  flatData: {
    title: 'Test Proposal 1234',
    type: 'Proposal',
    description: 'Text',
    link: null,
    addedDate: null,
    publishDate: '2021-05-21T13:18:31Z',
    labCatalogNumber: 'http://example.com',
    doi: '10.5555/YFRU1371',
    accession: 'U12345',
    rrid: 'RRID:AB_90755',
    tags: ['tag', 'test'],
    lastUpdatedPartial: '2020-09-23T16:34:26.842Z',
    authors: getSquidexResearchOutputGraphqlResponseAuthors(),
    accessInstructions: 'some access instructions',
    sharingStatus: 'Network Only',
    asapFunded: 'Yes',
    usedInAPublication: 'No',
    subtype: '3D Printing',
  },
  referencingTeamsContents: [
    {
      id: 'team-id-1',
      created: '2020-09-23T20:33:36Z',
      lastModified: '2020-11-26T11:56:04Z',
      flatData: {
        displayName: 'Schipa, A',
      },
      referencingUsersContents: [
        {
          id: '94adc252-cf5e-4950-bbcf-339e46d326a3',
          created: '2020-09-23T20:33:36Z',
          lastModified: '2020-11-26T11:56:04Z',
          flatData: {
            email: 'pm1@example.com',
            teams: [
              {
                id: [
                  {
                    id: 'team-id-1',
                    created: '2020-09-23T20:33:36Z',
                    lastModified: '2020-11-26T11:56:04Z',
                    flatData: {},
                  },
                ],
                role: 'Project Manager',
              },
            ],
          },
        },
        {
          id: '94adc252-cf5e-4950-bbcf-339e46d326a3',
          created: '2020-09-23T20:33:36Z',
          lastModified: '2020-11-26T11:56:04Z',
          flatData: {
            email: 'pm1@example.com',
            teams: [
              {
                id: [
                  {
                    id: 'team-id-1',
                    created: '2020-09-23T20:33:36Z',
                    lastModified: '2020-11-26T11:56:04Z',
                    flatData: {},
                  },
                ],
                role: 'Project Manager',
              },
            ],
          },
        },
        {
          id: '94adc252-cf5e-4950-bbcf-339e46d326a0',
          created: '2020-09-23T20:33:36Z',
          lastModified: '2020-11-26T11:56:04Z',
          flatData: {
            email: 'notapm1@example.com',
          },
        },
        {
          id: '94adc252-cf5e-4950-bbcf-339e46d326a1',
          created: '2020-09-23T20:33:36Z',
          lastModified: '2020-11-26T11:56:04Z',
          flatData: {
            email: 'notapm2@example.com',
            teams: [
              {
                id: [
                  {
                    id: 'wrong-team-id',
                    created: '2020-09-23T20:33:36Z',
                    lastModified: '2020-11-26T11:56:04Z',
                    flatData: {},
                  },
                ],
                role: 'Project Manager',
              },
            ],
          },
        },
        {
          id: '94adc252-cf5e-4950-bbcf-339e46d326a2',
          created: '2020-09-23T20:33:36Z',
          lastModified: '2020-11-26T11:56:04Z',
          flatData: {
            email: 'notapm3@example.com',
            teams: [
              {
                id: [
                  {
                    id: 'team-id-1',
                    created: '2020-09-23T20:33:36Z',
                    lastModified: '2020-11-26T11:56:04Z',
                    flatData: {},
                  },
                ],
                role: 'Key Personnel',
              },
            ],
          },
        },
      ],
    },
    {
      id: 'team-id-2',
      created: '2020-09-23T20:33:36Z',
      lastModified: '2020-11-26T11:56:04Z',
      flatData: {
        displayName: 'Team, B',
      },
      referencingUsersContents: [
        {
          id: '94adc252-cf5e-4950-bbcf-339e46d326a1',
          created: '2020-09-23T20:33:36Z',
          lastModified: '2020-11-26T11:56:04Z',
          flatData: {
            email: 'pm2@example.com',
            teams: [
              {
                id: [
                  {
                    id: 'team-id-2',
                    created: '2020-09-23T20:33:36Z',
                    lastModified: '2020-11-26T11:56:04Z',
                    flatData: {},
                  },
                ],
                role: 'Project Manager',
              },
            ],
          },
        },
        {
          id: '94adc252-cf5e-4950-bbcf-339e46d326a1',
          created: '2020-09-23T20:33:36Z',
          lastModified: '2020-11-26T11:56:04Z',
          flatData: {
            email: 'pm2@example.com',
            teams: [
              {
                id: [
                  {
                    id: 'team-id-2',
                    created: '2020-09-23T20:33:36Z',
                    lastModified: '2020-11-26T11:56:04Z',
                    flatData: {},
                  },
                ],
                role: 'Project Manager',
              },
            ],
          },
        },
        {
          id: '94adc252-cf5e-4950-bbcf-339e46d326a1',
          created: '2020-09-23T20:33:36Z',
          lastModified: '2020-11-26T11:56:04Z',
          flatData: {
            email: 'multiple-pms-on-same-team@example.com',
            teams: [
              {
                id: [
                  {
                    id: 'team-id-2',
                    created: '2020-09-23T20:33:36Z',
                    lastModified: '2020-11-26T11:56:04Z',
                    flatData: {},
                  },
                ],
                role: 'Project Manager',
              },
            ],
          },
        },
        {
          id: '94adc252-cf5e-4950-bbcf-339e46d326a0',
          created: '2020-09-23T20:33:36Z',
          lastModified: '2020-11-26T11:56:04Z',
          flatData: {
            email: 'notapm4@example.com',
          },
        },
      ],
    },
  ],
});

export const getResearchOutputResponse =
  (): DeepWriteable<ResearchOutputResponse> => ({
    created: '2020-09-23T16:34:26.842Z',
    id: 'ec3086d4-aa64-4f30-a0f7-5c5b95ffbcca',
    description: 'Text',
    title: 'Test Proposal 1234',
    type: 'Proposal',
    subTypes: ['3D Printing'],
    tags: ['tag', 'test'],
    authors: (fetchExpectation as DeepWriteable<ListUserResponse>).items,
    team: {
      id: 'team-id-1',
      displayName: 'Schipa, A',
    },
    teams: [
      {
        id: 'team-id-1',
        displayName: 'Schipa, A',
      },
      {
        id: 'team-id-2',
        displayName: 'Team, B',
      },
    ],
    publishDate: '2021-05-21T13:18:31Z',
    labCatalogNumber: 'http://example.com',
    doi: '10.5555/YFRU1371',
    accession: 'U12345',
    rrid: 'RRID:AB_90755',
    lastUpdatedPartial: '2020-09-23T16:34:26.842Z',
    accessInstructions: 'some access instructions',
    sharingStatus: 'Network Only',
    asapFunded: true,
    usedInPublication: false,
    pmsEmails: [
      'pm1@example.com',
      'pm2@example.com',
      'multiple-pms-on-same-team@example.com',
    ],
  });

export const getListResearchOutputResponse =
  (): ListResearchOutputResponse => ({
    total: 1,
    items: [getResearchOutputResponse()],
  });

export const getResearchOutputEvent = (): WebhookPayload<ResearchOutput> => ({
  type: 'ResearchOutputsPublished',
  timestamp: '2021-02-15T13:11:25Z',
  payload: {
    $type: 'EnrichedContentEvent',
    type: 'Published',
    id: 'researchOutputId',
    created: '2020-07-31T15:52:33Z',
    lastModified: '2020-07-31T15:52:33Z',
    data: {
      type: { iv: 'Article' },
      title: { iv: 'Research Output' },
      description: { iv: 'Description' },
      sharingStatus: { iv: 'Network Only' },
      asapFunded: { iv: 'Not Sure' },
      usedInAPublication: { iv: 'Not Sure' },
    } as Rest<ResearchOutput>['data'],
  },
});

export const updateResearchOutputEvent: WebhookPayload<ResearchOutput> = {
  type: 'ResearchOutputsUpdated',
  timestamp: '2021-02-15T13:11:25Z',
  payload: {
    $type: 'EnrichedContentEvent',
    type: 'Updated',
    id: 'userId',
    created: '2020-07-31T14:11:58Z',
    lastModified: '2020-07-31T15:49:41Z',
    data: {
      type: { iv: 'Article' },
      title: { iv: 'Research Output' },
      description: { iv: 'Description' },
      sharingStatus: { iv: 'Network Only' },
      asapFunded: { iv: 'Not Sure' },
      usedInAPublication: { iv: 'Not Sure' },
    } as Rest<ResearchOutput>['data'],
    dataOld: {
      type: { iv: 'Article' },
      title: { iv: 'Research Output' },
      description: { iv: 'Description' },
      sharingStatus: { iv: 'Network Only' },
      asapFunded: { iv: 'Not Sure' },
      usedInAPublication: { iv: 'Not Sure' },
    } as Rest<ResearchOutput>['data'],
  },
};
