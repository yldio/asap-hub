import {
  ListResearchOutputResponse,
  ListUserResponse,
  ResearchOutputResponse,
} from '@asap-hub/model';
import { GraphqlResearchOutput } from '@asap-hub/squidex';
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
    tags: ['tag', 'test'],
    lastUpdatedPartial: '2020-09-23T16:34:26.842Z',
    authors: graphQlResponseFetchUsers.data.queryUsersContentsWithTotal.items,
    accessInstructions: 'some access instructions',
    sharingStatus: 'Network Only',
    asapFunded: 'Yes',
    usedInAPublication: 'No',
  },
  referencingTeamsContents: [
    {
      id: 'team-id-1',
      created: '2020-09-23T20:33:36Z',
      lastModified: '2020-11-26T11:56:04Z',
      flatData: {
        displayName: 'Schipa, A',
      },
    },
    {
      id: 'team-id-2',
      created: '2020-09-23T20:33:36Z',
      lastModified: '2020-11-26T11:56:04Z',
      flatData: {
        displayName: 'Team, B',
      },
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
    tags: ['tag', 'test'],
    authors: (fetchExpectation as DeepWriteable<ListUserResponse>).items,
    team: {
      id: 'team-id-1',
      displayName: 'Schipa, A',
    },
<<<<<<< HEAD
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
    lastUpdatedPartial: '2020-09-23T16:34:26.842Z',
    accessInstructions: 'some access instructions',
    sharingStatus: 'Network Only',
    asapFunded: 'Yes',
  });
=======
    {
      id: 'team-id-2',
      displayName: 'Team, B',
    },
  ],
  publishDate: '2021-05-21T13:18:31Z',
  lastUpdatedPartial: '2020-09-23T16:34:26.842Z',
  accessInstructions: 'some access instructions',
  sharingStatus: 'Network Only',
  asapFunded: 'Yes',
  usedInPublication: 'No',
});
>>>>>>> added asap-funded to controllers and route

export const getListResearchOutputResponse =
  (): ListResearchOutputResponse => ({
    total: 1,
    items: [getResearchOutputResponse()],
  });
