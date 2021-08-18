import {
  ListResearchOutputResponse,
  ResearchOutputResponse,
} from '@asap-hub/model';
import { SearchResponse } from '@algolia/client-search';

import { listUserResponseItem } from './users';

const researchOutputResponse: Omit<
  ListResearchOutputResponse['items'][0],
  'id'
> = {
  created: '2020-09-07T17:36:54Z',
  addedDate: '2020-10-08T16:35:54Z',
  lastUpdatedPartial: '2020-11-09T20:36:54Z',
  lastModifiedDate: '2020-12-10T20:36:54Z',
  title: 'Output',
  description: 'description',
  type: 'Proposal',
  subTypes: ['3D Printing'],
  tags: ['test', 'tag'],
  authors: [
    {
      id: 'e12729e0-bfdd-471f-a554-7b58eae83a8d',
      ...listUserResponseItem,
    },
  ],
  team: {
    id: 'e12729e0-a244-471f-a554-7b58eae83a8d',
    displayName: 'Jakobsson, J',
  },
  teams: [
    {
      id: 'e12729e0-a244-471f-a554-7b58eae83a8d',
      displayName: 'Jakobsson, J',
    },
  ],
  sharingStatus: 'Public',
  pmsEmails: [],
};

export const createResearchOutputResponse = (
  itemIndex = 0,
): ResearchOutputResponse => ({
  ...researchOutputResponse,
  id: `ro${itemIndex}`,
  title: `${researchOutputResponse.title} ${itemIndex + 1}`,
});

export const createListResearchOutputResponse = (
  items: number,
): ListResearchOutputResponse => ({
  total: items,
  items: Array.from({ length: items }, (_, itemIndex) =>
    createResearchOutputResponse(itemIndex),
  ),
});

// Incomplete mock. @todo: Make helper function to add algolia meta data in future.
export const createAlgoliaResearchOutputResponse = (
  items: number,
): SearchResponse<ResearchOutputResponse> => {
  const response: Partial<SearchResponse<ResearchOutputResponse>> = {
    nbHits: items,
    hits: Array.from({ length: items }, (_, itemIndex) => ({
      ...createResearchOutputResponse(itemIndex),
      objectID: `ro${itemIndex}`,
    })),
  };
  return response as SearchResponse<ResearchOutputResponse>;
};

export default createListResearchOutputResponse;
