import { gp2 } from '@asap-hub/model';

import { mockedUser } from './users';

const userAuthor: gp2.UserAuthor = {
  id: mockedUser.id,
  firstName: mockedUser.firstName,
  lastName: mockedUser.lastName,
  onboarded: mockedUser.onboarded,
};

const OutputResponse: Omit<gp2.ListOutputResponse['items'][0], 'id'> = {
  created: '2020-09-07T17:36:54Z',
  addedDate: '2020-10-08T16:35:54Z',
  lastUpdatedPartial: '2020-11-09T20:36:54Z',
  lastModifiedDate: '2020-12-10T20:36:54Z',
  title: 'Output',
  authors: [userAuthor],
  documentType: 'Code/Software',
};

export const createOutputResponse = (itemIndex = 0): gp2.OutputResponse => ({
  ...OutputResponse,
  id: `ro${itemIndex}`,
  title: `${OutputResponse.title} ${itemIndex + 1}`,
});

export const createListOutputResponse = (
  items: number,
): gp2.ListOutputResponse => ({
  total: items,
  items: Array.from({ length: items }, (_, itemIndex) =>
    createOutputResponse(itemIndex),
  ),
});

export default createListOutputResponse;
