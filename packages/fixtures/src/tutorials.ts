import { TutorialsResponse, ListTutorialsResponse } from '@asap-hub/model';
import { listUserResponseItem } from './users';

type FixtureOptions = {
  key: string | number;
};

export const createTutorialsResponse = ({
  key,
}: FixtureOptions): TutorialsResponse => ({
  id: `uuid-${key}`,
  title: `${key} title`,
  shortText: `${key} short text`,
  text: `<h1>${key} text</h1>`,
  created: new Date().toISOString(),
  addedDate: new Date().toISOString(),
  lastUpdated: new Date().toISOString(),
  datePublished: new Date().toISOString(),
  tags: [],
  sharingStatus: 'Public',
  asapFunded: false,
  usedInPublication: false,
  relatedEvents: [
    {
      id: 'e12729e0-bfdd-471f-a554-7b58eae83a8d',
      title: 'Example Event',
      endDate: '2020-12-10T20:36:54Z',
    },
  ],
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
  relatedTutorials: [
    {
      id: 'e12729e0-bfdd-471f-a554-7b58eae83a8d',
      title: 'Example Event',
      created: '2020-12-10T20:36:54Z',
    },
    {
      id: 'e12729e0-bfdd-471f-a554-7b58eae83a8e',
      title: 'Example Event2',
      created: '2020-12-11T20:36:54Z',
    },
  ],
});

export const createListTutorialsResponse = (
  items: number,
): ListTutorialsResponse => ({
  total: items,
  items: Array.from({ length: items }, (_, itemIndex) =>
    createTutorialsResponse({ key: itemIndex }),
  ),
});
