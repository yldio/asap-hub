import {
  ListResearchOutputResponse,
  ResearchOutputResponse,
} from '@asap-hub/model';

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
  type: 'Grant Document',
  subTypes: ['3D Printing'],
  tags: ['test', 'tag'],
  authors: [
    {
      id: 'e12729e0-bfdd-471f-a554-7b58eae83a8d',
      ...listUserResponseItem,
    },
  ],
  teams: [
    {
      id: 'e12729e0-a244-471f-a554-7b58eae83a8d',
      displayName: 'Jakobsson, J',
    },
  ],
  sharingStatus: 'Public',
  contactEmails: [],
  labs: [],
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

export default createListResearchOutputResponse;
