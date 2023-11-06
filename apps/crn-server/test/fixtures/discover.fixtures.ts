import {
  DiscoverDataObject,
  DiscoverResponse,
  UserResponse,
} from '@asap-hub/model';

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
    avatarUrl: `https://www.contentful.com/api/assets/asap-crn/${prefix}uuid-1`,
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
  members: getDiscoverMembersResponse(),
  membersTeamId: 'uuid-team-1',
  scientificAdvisoryBoard: getDiscoverMembersResponse('sab-'),
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
      url: `https://www.contentful.com/api/assets/asap-crn/uuid-1`,
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
  membersTeam: {
    sys: {
      id: 'uuid-team-1',
    },
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
          url: `https://www.contentful.com/api/assets/asap-crn/sab-uuid-1`,
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
