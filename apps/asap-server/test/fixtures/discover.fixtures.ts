import { config } from '@asap-hub/squidex';
import type { DiscoverResponse } from '@asap-hub/model';
import type { SquidexDiscoverResponse } from '../../src/controllers/discover';

export const squidexDiscoverResponse: SquidexDiscoverResponse = {
  queryDiscoverContents: [
    {
      flatData: {
        training: [
          {
            id: 'uuid',
            created: '2020-09-24T11:06:27.164Z',
            lastModified: '2020-10-15T17:55:21Z',
            version: 42,
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
            version: 42,
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
            version: 42,
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
            version: 42,
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
            version: 42,
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
      onboarded: true,
      createdDate: '2020-10-15T17:55:21.000Z',
      displayName: 'John Doe',
      email: 'john@example.com',
      firstName: 'John',
      lastModifiedDate: '2020-10-15T17:55:21Z',
      lastName: 'Doe',
      orcidWorks: [],
      questions: [],
      expertiseAndResourceTags: [],
      social: {},
      teams: [],
      avatarUrl: `${config.baseUrl}/api/assets/${config.appName}/uuid-1`,
      role: 'Guest',
      labs: [],
    },
    {
      id: 'uuid-2',
      onboarded: true,
      createdDate: '2020-10-14T17:55:21.000Z',
      displayName: 'Jon Do',
      email: '',
      firstName: 'Jon',
      lastModifiedDate: '2020-10-15T17:55:21Z',
      lastName: 'Do',
      orcidWorks: [],
      questions: [],
      expertiseAndResourceTags: [],
      teams: [],
      social: {},
      reachOut: 'reach out',
      responsibilities: 'responsibilities',
      role: 'Staff',
      labs: [],
    },
  ],
  aboutUs: '<p>content<p>',
};

const squidexGraphqlDiscoverFlatData = () => ({
  training: [
    {
      id: 'uuid-training-1',
      created: '2020-09-24T11:06:27.164Z',
      lastModified: '2020-10-15T17:55:21Z',
      version: 42,
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
      id: 'uuid-pages-1',
      created: '2020-09-24T11:06:27.164Z',
      lastModified: '2020-10-15T17:55:21Z',
      version: 42,
      flatData: {
        path: '/',
        title: 'Title',
        text: 'Content',
        link: 'https://hub.asap.science',
        linkText: 'ASAP Hub',
      },
    },
    {
      id: 'uuid-pages-2',
      created: '2020-09-24T11:06:27.164Z',
      lastModified: '2020-10-15T17:55:21Z',
      version: 42,
      flatData: {
        path: '/s',
        title: 'Title',
      },
    },
  ],
  members: [
    {
      id: 'uuid-members-1',
      created: '2020-10-15T17:55:21Z',
      lastModified: '2020-10-15T17:55:21Z',
      version: 42,
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
      id: 'uuid-members-2',
      created: '2020-10-14T17:55:21Z',
      lastModified: '2020-10-15T17:55:21Z',
      version: 42,
      flatData: {
        email: null,
        lastModifiedDate: '2020-10-15T17:55:21Z',
        lastName: 'Do',
        role: 'Staff',
        responsibilities: 'responsibilities',
        reachOut: 'reach out',
      },
    },
  ],
  aboutUs: '<p>content<p>',
});

export const getSquidexGraphqlDiscover = () => ({
  id: 'ec3086d4-aa64-4f30-a0f7-5c5b95ffbcca',
  created: '2020-09-23T16:34:26.842Z',
  lastModified: '2021-05-14T14:48:46Z',
  version: 42,
  flatData: squidexGraphqlDiscoverFlatData(),
});

export const squidexGraphqlDiscoverResponse = () => ({
  aboutUs: '<p>content<p>',
  training: [
    {
      id: 'uuid-training-1',
      created: '2020-09-24T11:06:27.164Z',
      title: 'Title',
      text: 'Content',
      link: 'https://hub.asap.science',
      linkText: 'ASAP Training',
      type: 'Training',
    },
  ],
  members: [
    {
      id: 'uuid-members-1',
      onboarded: true,
      createdDate: '2020-10-15T17:55:21.000Z',
      displayName: 'John Doe',
      orcid: undefined,
      firstName: 'John',
      lastName: 'Doe',
      biography: undefined,
      degree: undefined,
      email: 'john@example.com',
      contactEmail: undefined,
      country: undefined,
      city: undefined,
      orcidWorks: [],
      questions: [],
      expertiseAndResourceTags: [],
      expertiseAndResourceDescription: undefined,
      lastModifiedDate: '2020-10-15T17:55:21Z',
      teams: [],
      social: {},
      avatarUrl: 'https://cloud.squidex.io/api/assets/1153/uuid-1',
      role: 'Guest',
      responsibilities: undefined,
      reachOut: undefined,
      labs: [],
    },
    {
      id: 'uuid-members-2',
      onboarded: true,
      createdDate: '2020-10-14T17:55:21.000Z',
      orcid: undefined,
      lastName: 'Do',
      biography: undefined,
      degree: undefined,
      email: '',
      contactEmail: undefined,
      country: undefined,
      city: undefined,
      orcidWorks: [],
      questions: [],
      expertiseAndResourceTags: [],
      expertiseAndResourceDescription: undefined,
      lastModifiedDate: '2020-10-15T17:55:21Z',
      teams: [],
      social: {},
      role: 'Guest',
      responsibilities: undefined,
      reachOut: undefined,
      labs: [],
    },
  ],
  pages: [
    {
      id: 'uuid-pages-1',
      path: '',
      title: 'Title',
      text: 'Content',
      link: 'https://hub.asap.science',
      linkText: 'ASAP Hub',
    },
    {
      id: 'uuid-pages-2',
      path: '',
      title: 'Title',
    },
  ],
});
