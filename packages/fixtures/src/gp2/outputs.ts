import { gp2 } from '@asap-hub/model';

import { mockedUser } from './users';

const userAuthor: gp2.UserAuthor = {
  id: mockedUser.id,
  firstName: mockedUser.firstName,
  lastName: mockedUser.lastName,
  displayName: mockedUser.displayName,
  email: mockedUser.email,
  onboarded: mockedUser.onboarded,
};

const outputResponse: Omit<gp2.ListOutputResponse['items'][0], 'id'> = {
  created: '2020-09-07T17:36:54Z',
  addedDate: '2020-10-08T16:35:54Z',
  lastUpdatedPartial: '2020-11-09T20:36:54Z',
  lastModifiedDate: '2020-12-10T20:36:54Z',
  title: 'Output',
  sharingStatus: 'Public',
  authors: [userAuthor],
  documentType: 'Code/Software',
  relatedOutputs: [],
  mainEntity: { id: '42', title: 'a project', type: 'Projects' },
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
