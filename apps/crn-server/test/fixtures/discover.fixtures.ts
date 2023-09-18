import {
  DiscoverDataObject,
  DiscoverResponse,
  UserResponse,
} from '@asap-hub/model';
import { appName, baseUrl } from '../../src/config';

const getDiscoverMembersResponse = (prefix = ''): UserResponse[] => [
  {
    id: `${prefix}uuid-members-1`,
    onboarded: true,
    createdDate: '2020-10-15T17:55:21.000Z',
    displayName: `${prefix}John ${prefix}Doe`,
    orcid: undefined,
    firstName: `${prefix}John`,
    lastName: `${prefix}Doe`,
    biography: undefined,
    degree: undefined,
    email: `${prefix}john@example.com`,
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
    avatarUrl: `${baseUrl}/api/assets/${appName}/${prefix}uuid-1`,
    role: 'Guest',
    responsibilities: undefined,
    reachOut: undefined,
    labs: [],
    workingGroups: [],
    interestGroups: [],
  },
  {
    id: `${prefix}uuid-members-2`,
    onboarded: true,
    createdDate: '2020-10-14T17:55:21.000Z',
    orcid: undefined,
    displayName: `${prefix}John ${prefix}Do`,
    firstName: `${prefix}John`,
    lastName: `${prefix}Do`,
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
    workingGroups: [],
    interestGroups: [],
  },
];

export const getDiscoverDataObject = (): DiscoverDataObject => ({
  aboutUs: '<p>content</p>',
  training: [
    {
      id: 'uuid-training-1',
      created: '2020-09-24T11:06:27.164Z',
      title: 'Title',
      text: '<p>Content</p>',
      link: 'https://hub.asap.science',
      linkText: 'ASAP Training',
      shortText: 'Short text',
      thumbnail: `${baseUrl}/api/assets/${appName}/thumbnail-uuid-1`,
    },
  ],
  members: getDiscoverMembersResponse(),
  membersTeamId: 'uuid-team-1',
  scientificAdvisoryBoard: getDiscoverMembersResponse('sab-'),
  pages: [
    {
      id: 'uuid-pages-1',
      path: '',
      title: 'Title',
      text: '<p>Content</p>',
      link: 'https://hub.asap.science',
      linkText: 'ASAP Hub',
      shortText: 'Short text',
    },
    {
      id: 'uuid-pages-2',
      path: '',
      title: 'Title',
      shortText: 'Short text',
      text: '<p>Content</p>',
    },
  ],
});

export const getDiscoverResponse = (): DiscoverResponse =>
  getDiscoverDataObject();

export const getContentfulGraphqlDiscoverResponse = (props = {}) => ({
  discoverCollection: {
    items: [getContentfulGraphqlDiscover(props)],
  },
});

export const getContentfulGraphqlDiscoverMembers = () => [
  {
    sys: {
      id: 'uuid-members-1',
      firstPublishedAt: '2020-10-15T17:55:21.000Z',
      publishedAt: '2020-10-15T17:55:21Z',
    },
    lastUpdated: '2020-10-15T17:55:21Z',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    avatar: {
      url: `${baseUrl}/api/assets/${appName}/uuid-1`,
    },
  },
  {
    sys: {
      id: 'uuid-members-2',
      firstPublishedAt: '2020-10-14T17:55:21.000Z',
      publishedAt: '2020-10-15T17:55:21Z',
    },
    lastUpdated: '2020-10-15T17:55:21Z',
    firstName: 'John',
    lastName: 'Do',
    email: '',
  },
];

export const getContentfulGraphqlDiscover = (props = {}) => ({
  membersCollection: {
    items: getContentfulGraphqlDiscoverMembers(),
  },
  pagesCollection: {
    items: [
      {
        sys: {
          id: 'uuid-pages-1',
        },
        link: 'https://hub.asap.science',
        linkText: 'ASAP Hub',
        title: 'Title',
        text: {
          json: {
            nodeType: 'document',
            data: {},
            content: [
              {
                nodeType: 'paragraph',
                data: {},
                content: [
                  { nodeType: 'text', value: 'Content', marks: [], data: {} },
                ],
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
        shortText: 'Short text',
        path: null,
      },
      {
        sys: {
          id: 'uuid-pages-2',
        },
        link: null,
        linkText: null,
        title: 'Title',
        text: {
          json: {
            nodeType: 'document',
            data: {},
            content: [
              {
                nodeType: 'paragraph',
                data: {},
                content: [
                  { nodeType: 'text', value: 'Content', marks: [], data: {} },
                ],
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
        shortText: 'Short text',
        path: null,
      },
    ],
  },
  membersTeam: {
    sys: {
      id: 'uuid-team-1',
    },
  },
  trainingCollection: {
    items: [
      {
        sys: {
          id: 'uuid-training-1',
        },
        publishDate: '2020-09-24T11:06:27.164Z',
        link: 'https://hub.asap.science',
        linkText: 'ASAP Training',
        text: {
          json: {
            nodeType: 'document',
            data: {},
            content: [
              {
                nodeType: 'paragraph',
                data: {},
                content: [
                  { nodeType: 'text', value: 'Content', marks: [], data: {} },
                ],
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
        title: 'Title',
        shortText: 'Short text',
        thumbnail: {
          url: `${baseUrl}/api/assets/${appName}/thumbnail-uuid-1`,
        },
      },
    ],
  },
  scientificAdvisoryBoardCollection: {
    items: [
      {
        sys: {
          id: 'sab-uuid-members-1',
          firstPublishedAt: '2020-10-15T17:55:21.000Z',
          publishedAt: '2020-10-15T17:55:21Z',
        },
        firstName: 'sab-John',
        lastName: 'sab-Doe',
        email: 'sab-john@example.com',
        avatar: {
          url: `${baseUrl}/api/assets/${appName}/sab-uuid-1`,
        },
        lastUpdated: '2020-10-15T17:55:21Z',
      },
      {
        sys: {
          id: 'sab-uuid-members-2',
          firstPublishedAt: '2020-10-14T17:55:21.000Z',
          publishedAt: '2020-10-15T17:55:21Z',
        },
        firstName: 'sab-John',
        lastName: 'sab-Do',
        email: '',
        lastUpdated: '2020-10-15T17:55:21Z',
      },
    ],
  },
  aboutUs: {
    json: {
      nodeType: 'document',
      data: {},
      content: [
        {
          nodeType: 'paragraph',
          data: {},
          content: [
            { nodeType: 'text', value: 'content', marks: [], data: {} },
          ],
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
  ...props,
});
