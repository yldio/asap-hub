import {
  ListTutorialsDataObject,
  TutorialsDataObject,
  TutorialsResponse,
  ListTutorialsResponse,
} from '@asap-hub/model';
import { TutorialsContentFragment } from '@asap-hub/contentful';

export const getTutorialsDataObject = (): TutorialsDataObject => ({
  id: 'tutorial-1',
  title: 'Tutorial 1',
  shortText: 'Short text of tutorial 1',
  text: '<p>text</p>',
  link: 'https://parkinsonsroadmap.org/#',
  linkText: 'ASAP',
  thumbnail: `https://www.contentful.com/api/assets/asap-crn/thumbnail-uuid1`,
  created: '2020-09-08T16:35:28.000Z',
  authors: [],
  teams: [{ id: 'team-id-0', displayName: 'Team A' }],
  sharingStatus: 'Network Only',
  asapFunded: true,
  usedInPublication: false,
  tags: ['Keyword1'],
  relatedEvents: [
    {
      id: 'related-event-id-0',
      title: 'Related Event 1',
      endDate: '2021-05-21T13:18:31.000Z',
    },
  ],
  relatedTutorials: [
    {
      id: 'related-tutorial-id-0',
      title: 'Related Tutorial1',
      created: '2020-09-08T16:35:28.000Z',
      isOwnRelatedTutorialLink: true,
    },
    {
      id: 'related-referencing-tutorial-id',
      title: 'Related Tutorial2',
      created: '2020-09-08T16:35:28.000Z',
      isOwnRelatedTutorialLink: false,
    },
  ],
});

export const getTutorialResponse = (): TutorialsResponse =>
  getTutorialsDataObject();

export const getListTutorialsResponse = (): ListTutorialsResponse => ({
  total: 1,
  items: [getTutorialResponse()],
});
export const getListTutorialsDataObject = (): ListTutorialsDataObject => ({
  total: 1,
  items: [getTutorialsDataObject()],
});

export const getContentfulGraphqlTutorial = (): TutorialsContentFragment => {
  return {
    sys: {
      id: 'tutorial-1',
    },
    addedDate: '2020-09-08T16:35:28.000Z',
    title: 'Tutorial 1',
    shortText: 'Short text of tutorial 1',
    text: {
      json: {
        nodeType: 'document',
        data: {},
        content: [
          {
            nodeType: 'paragraph',
            data: {},
            content: [{ nodeType: 'text', value: 'text', marks: [], data: {} }],
          },
        ],
      },
      links: {
        entries: {
          inline: [],
        },
        assets: {
          block: [],
        },
      },
    },
    link: 'https://parkinsonsroadmap.org/#',
    linkText: 'ASAP',
    thumbnail: {
      url: `https://www.contentful.com/api/assets/asap-crn/thumbnail-uuid1`,
    },
    sharingStatus: 'Network Only',
    relatedTutorialsCollection: {
      items: [
        {
          sys: {
            id: 'related-tutorial-id-0',
          },
          title: 'Related Tutorial1',
          addedDate: '2020-09-08T16:35:28.000Z',
        },
      ],
    },
    linkedFrom: {
      tutorialsCollection: {
        items: [
          {
            sys: {
              id: 'related-referencing-tutorial-id',
            },
            title: 'Related Tutorial2',
            addedDate: '2020-09-08T16:35:28.000Z',
          },
        ],
      },
    },
    authorsCollection: { items: [] },
    teamsCollection: {
      items: [
        {
          sys: {
            id: 'team-id-0',
          },
          displayName: 'Team A',
        },
      ],
    },
    tagsCollection: {
      items: [
        {
          name: 'Keyword1',
        },
      ],
    },
    relatedEventsCollection: {
      items: [
        {
          sys: {
            id: 'related-event-id-0',
          },
          title: 'Related Event 1',
          endDate: '2021-05-21T13:18:31.000Z',
        },
      ],
    },
    asapFunded: 'Yes',
    usedInAPublication: 'No',
  };
};
