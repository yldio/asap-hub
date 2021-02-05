import { config } from '@asap-hub/squidex';
import { DiscoverResponse } from '@asap-hub/model';
import { SquidexDiscoverResponse } from '../../src/controllers/discover';

export const squidexDiscoverResponse: SquidexDiscoverResponse = {
  queryDiscoverContents: [
    {
      flatData: {
        training: [
          {
            id: 'uuid',
            created: '2020-09-24T11:06:27.164Z',
            lastModified: '2020-10-15T17:55:21Z',
            flatData: {
              title: 'Title',
              text: 'Content',
              link: 'https://hub.asap.science',
              linkText: 'ASAP Training',
              type: 'Training',
            },
          },
        ],
        pages: [
          {
            id: 'uuid',
            created: '2020-09-24T11:06:27.164Z',
            lastModified: '2020-10-15T17:55:21Z',
            flatData: {
              path: '/',
              title: 'Title',
              text: 'Content',
              link: 'https://hub.asap.science',
              linkText: 'ASAP Hub',
            },
          },
          {
            id: 'uuid',
            created: '2020-09-24T11:06:27.164Z',
            lastModified: '2020-10-15T17:55:21Z',
            flatData: {
              path: '/',
              title: 'Title',
            },
          },
        ],
        members: [
          {
            id: 'uuid-1',
            created: '2020-10-15T17:55:21Z',
            lastModified: '2020-10-15T17:55:21Z',
            flatData: {
              avatar: [
                {
                  id: 'uuid-1',
                },
              ],
              email: 'john@example.com',
              firstName: 'John',
              lastModifiedDate: '2020-10-15T17:55:21Z',
              lastName: 'Doe',
            },
          },
          {
            id: 'uuid-2',
            created: '2020-10-14T17:55:21Z',
            lastModified: '2020-10-15T17:55:21Z',
            flatData: {
              email: null,
              firstName: 'Jon',
              lastModifiedDate: '2020-10-15T17:55:21Z',
              lastName: 'Do',
              role: 'Staff',
              responsibilities: 'responsibilities',
              reachOut: 'reach out',
            },
          },
        ],
        aboutUs: '<p>content<p>',
      },
    },
  ],
};

export const discoverResponse: DiscoverResponse = {
  training: [
    {
      created: '2020-09-24T11:06:27.164Z',
      id: 'uuid',
      link: 'https://hub.asap.science',
      linkText: 'ASAP Training',
      shortText: '',
      text: 'Content',
      title: 'Title',
      type: 'Training',
    },
  ],
  pages: [
    {
      id: 'uuid',
      link: 'https://hub.asap.science',
      linkText: 'ASAP Hub',
      path: '/',
      shortText: '',
      title: 'Title',
      text: 'Content',
    },
    {
      id: 'uuid',
      link: '',
      linkText: '',
      path: '/',
      shortText: '',
      title: 'Title',
      text: '',
    },
  ],
  members: [
    {
      id: 'uuid-1',
      createdDate: '2020-10-15T17:55:21.000Z',
      displayName: 'John Doe',
      email: 'john@example.com',
      firstName: 'John',
      lastModifiedDate: '2020-10-15T17:55:21Z',
      lastName: 'Doe',
      orcidWorks: [],
      questions: [],
      skills: [],
      social: {},
      teams: [],
      avatarUrl: `${config.baseUrl}/api/assets/${config.appName}/uuid-1`,
      role: 'Guest',
    },
    {
      id: 'uuid-2',
      createdDate: '2020-10-14T17:55:21.000Z',
      displayName: 'Jon Do',
      email: '',
      firstName: 'Jon',
      lastModifiedDate: '2020-10-15T17:55:21Z',
      lastName: 'Do',
      orcidWorks: [],
      questions: [],
      skills: [],
      teams: [],
      social: {},
      reachOut: 'reach out',
      responsibilities: 'responsibilities',
      role: 'Staff',
    },
  ],
  aboutUs: '<p>content<p>',
};
