import { gp2, UserAuthorResponse } from '@asap-hub/model';

import { mockedUser } from './users';

const userAuthor: UserAuthorResponse['user'] = {
  id: mockedUser.id,
  firstName: mockedUser.firstName,
  lastName: mockedUser.lastName,
  displayName: mockedUser.displayName,
};

const outputResponse: Omit<gp2.ListOutputResponse['items'][0], 'id'> = {
  created: '2020-09-07T17:36:54Z',
  addedDate: '2020-10-08T16:35:54Z',
  lastUpdatedPartial: '2020-11-09T20:36:54Z',
  lastModifiedDate: '2020-12-10T20:36:54Z',
  title: 'Output',
  sharingStatus: 'Public',
  authors: [{ user: userAuthor }],
  documentType: 'Code/Software',
  mainEntity: { id: '42', title: 'a project', type: 'Projects' },
  contributingCohorts: [],
  tags: [],
  relatedOutputs: [],
  relatedEvents: [],
};

export const createOutputResponse = (itemIndex = 0): gp2.OutputResponse => ({
  ...outputResponse,
  id: `ro${itemIndex}`,
  title: `${outputResponse.title} ${itemIndex + 1}`,
  description: 'An interesting article',
  gp2Supported: 'Yes',
  sharingStatus: 'GP2 Only',
});

export const createListOutputResponse = (
  items: number = 1,
): gp2.ListOutputResponse => ({
  total: items,
  items: Array.from({ length: items }, (_, itemIndex) =>
    createOutputResponse(itemIndex),
  ),
});

export default createListOutputResponse;
