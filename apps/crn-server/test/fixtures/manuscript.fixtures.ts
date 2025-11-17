import {
  FetchManuscriptByIdQuery,
  FetchManuscriptsQuery,
} from '@asap-hub/contentful';
import { manuscriptAuthor } from '@asap-hub/fixtures';
import {
  ListPartialManuscriptResponse,
  ManuscriptCreateControllerDataObject,
  ManuscriptCreateDataObject,
  ManuscriptDataObject,
  ManuscriptDiscussion,
  ManuscriptFileResponse,
  ManuscriptPostRequest,
  ManuscriptResponse,
  ManuscriptUpdateDataObject,
  ManuscriptVersion,
} from '@asap-hub/model';

export const getManuscriptDataObject = (
  data: Partial<ManuscriptDataObject> = {},
): ManuscriptDataObject => ({
  id: 'manuscript-id-1',
  title: 'Manuscript Title',
  teamId: 'team-1',
  count: 1,
  discussions: [],
  assignedUsers: [
    {
      id: 'user-id-1',
      firstName: 'John',
      lastName: 'Doe',
      avatarUrl: 'https://example.com/avatar.png',
    },
  ],
  apcAmountPaid: undefined,
  versions: [
    {
      id: 'version-1',
      lifecycle: 'Preprint',
      type: 'Original Research',
      description: 'A good description',
      shortDescription: 'A good short description',
      count: 1,
      createdBy: manuscriptAuthor,
      updatedBy: manuscriptAuthor,
      createdDate: '2020-09-23T20:45:22.000Z',
      publishedAt: '2020-09-23T20:45:22.000Z',
      manuscriptFile: {
        filename: 'manuscript.pdf',
        url: 'https://example.com/manuscript.pdf',
        id: 'file-id',
      },
      keyResourceTable: {
        filename: 'manuscript.csv',
        url: 'https://example.com/manuscript.csv',
        id: 'file-table-id',
      },
      teams: [
        { id: 'team-1', displayName: 'Test 1', inactiveSince: undefined },
      ],
      labs: [{ id: 'lab-1', name: 'Lab 1' }],
      firstAuthors: [],
      correspondingAuthor: [],
      additionalAuthors: [],
    },
  ],
  ...data,
});

export const getManuscriptResponse = (
  data: Partial<ManuscriptDataObject> = {},
): ManuscriptResponse => getManuscriptDataObject(data);

export const getManuscriptFileResponse = (): ManuscriptFileResponse => ({
  filename: 'manuscript.pdf',
  url: 'https://example.com/manuscript.pdf',
  id: 'file-id',
});

export const getManuscriptGraphqlAssignedUsersCollection = (): NonNullable<
  NonNullable<
    NonNullable<FetchManuscriptByIdQuery>['manuscripts']
  >['assignedUsersCollection']
> => ({
  items: [
    {
      sys: { id: 'user-id-1' },
      firstName: 'John',
      lastName: 'Doe',
      avatar: {
        url: 'https://example.com/avatar.png',
      },
    },
  ],
});

export const getContentfulGraphqlManuscript = (
  props: Partial<
    NonNullable<NonNullable<FetchManuscriptByIdQuery>['manuscripts']>
  > = {},
): NonNullable<NonNullable<FetchManuscriptByIdQuery>['manuscripts']> => ({
  sys: {
    id: 'manuscript-id-1',
  },
  title: 'Manuscript Title',
  count: 1,
  status: 'Compliant',
  apcRequested: false,
  apcAmountPaid: null,
  teamsCollection: {
    items: [{ sys: { id: 'team-1' } }],
  },
  versionsCollection: getContentfulGraphqlManuscriptVersions(),
  ...props,
});

export const getContentfulGraphqlManuscriptVersions = (
  teamId?: string,
): NonNullable<
  NonNullable<
    NonNullable<FetchManuscriptByIdQuery>['manuscripts']
  >['versionsCollection']
> => ({
  items: [
    {
      sys: {
        id: 'version-1',
        publishedAt: '2020-09-23T20:45:22.000Z',
        firstPublishedAt: '2020-09-23T20:45:22.000Z',
      },
      type: 'Original Research',
      lifecycle: 'Preprint',
      description: 'A good description',
      shortDescription: 'A good short description',
      count: 1,
      manuscriptFile: {
        sys: { id: 'file-id' },
        fileName: 'manuscript.pdf',
        url: 'https://example.com/manuscript.pdf',
      },
      keyResourceTable: {
        sys: { id: 'file-table-id' },
        fileName: 'manuscript.csv',
        url: 'https://example.com/manuscript.csv',
      },
      teamsCollection: {
        items: [
          {
            sys: { id: teamId || 'team-1' },
            displayName: 'Test 1',
            inactiveSince: null,
          },
        ],
      },
      labsCollection: {
        items: [
          {
            sys: { id: 'lab-1' },
            name: 'Lab 1',
          },
        ],
      },
      firstAuthorsCollection: {
        items: [],
      },
      correspondingAuthorCollection: {
        items: [],
      },
      additionalAuthorsCollection: {
        items: [],
      },
      createdBy: {
        sys: {
          id: manuscriptAuthor.id,
        },
        firstName: manuscriptAuthor.firstName,
        lastName: manuscriptAuthor.lastName,
        nickname: 'Tim',
        alumniSinceDate: manuscriptAuthor.alumniSinceDate,
        avatar: { url: manuscriptAuthor.avatarUrl },
        teamsCollection: {
          items: [
            {
              team: {
                sys: {
                  id: manuscriptAuthor.teams[0]!.id,
                },
                displayName: manuscriptAuthor.teams[0]!.name,
              },
            },
          ],
        },
      },
      updatedBy: {
        sys: {
          id: manuscriptAuthor.id,
        },
        firstName: manuscriptAuthor.firstName,
        lastName: manuscriptAuthor.lastName,
        nickname: 'Tim',
        alumniSinceDate: manuscriptAuthor.alumniSinceDate,
        avatar: { url: manuscriptAuthor.avatarUrl },
        teamsCollection: {
          items: [
            {
              team: {
                sys: {
                  id: manuscriptAuthor.teams[0]!.id,
                },
                displayName: manuscriptAuthor.teams[0]!.name,
              },
            },
          ],
        },
      },
    },
  ],
});

export const getContentfulGraphqlManuscriptsCollection = (): NonNullable<
  NonNullable<FetchManuscriptsQuery>['manuscriptsCollection']
> => ({
  total: 1,
  items: [
    {
      sys: {
        id: 'manuscript-id-1',
      },
      title: 'Manuscript Title',
      status: 'Compliant',
      count: 1,
      teamsCollection: {
        items: [
          {
            sys: { id: 'team-1' },
            displayName: 'Test Team',
            linkedFrom: {
              projectMembershipCollection: {
                items: [
                  {
                    linkedFrom: {
                      projectsCollection: {
                        items: [
                          {
                            projectId: '',
                            grantId: '',
                          },
                        ],
                      },
                    },
                  },
                ],
              },
            },
          },
        ],
      },
      versionsCollection: {
        items: [
          {
            sys: {
              id: '',
              publishedAt: '2020-09-23T20:45:22.000Z',
            },
            type: '',
            lifecycle: '',
            count: 1,
          },
        ],
      },
    },
  ],
});

export const getManuscriptDiscussions = (): ManuscriptDiscussion => ({
  id: 'discussion-id-1',
  read: false,
  title: 'Where does Lorem Ipsum come from?',
  text: 'It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old.',
  lastUpdatedAt: '2025-04-01T15:00:00.000Z',
  createdDate: '2025-03-31T10:00:00.000Z',
  createdBy: {
    alumniSinceDate: undefined,
    avatarUrl: undefined,
    displayName: 'John Doe',
    firstName: 'John',
    id: 'user-id-1',
    lastName: 'Doe',
    teams: [
      {
        id: 'team-id-1',
        name: 'Team 1',
      },
    ],
  },
  replies: [
    {
      createdBy: {
        alumniSinceDate: undefined,
        avatarUrl: undefined,
        displayName: 'Jane (Jenny) Doe',
        firstName: 'Jane',
        id: 'user-id-2',
        lastName: 'Doe',
        teams: [
          {
            id: 'team-asap',
            name: 'ASAP',
          },
        ],
      },
      createdDate: '2025-04-01T15:00:00.000Z',
      text: 'A new comment',
    },
  ],
});

export const getContentfulGraphqlManuscriptDiscussion = (): NonNullable<
  NonNullable<
    NonNullable<
      NonNullable<FetchManuscriptByIdQuery>['manuscripts']
    >['discussionsCollection']
  >['items'][number]
> => ({
  sys: {
    id: 'discussion-id-1',
    publishedVersion: 3,
  },
  title: 'Where does Lorem Ipsum come from?',
  message: {
    sys: {
      publishedAt: '2025-03-31T10:00:00.000Z',
    },
    text: 'It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old.',
    createdBy: {
      sys: {
        id: 'user-id-1',
      },
      firstName: 'John',
      nickname: null,
      lastName: 'Doe',
      alumniSinceDate: null,
      avatar: null,
      teamsCollection: {
        items: [
          {
            team: {
              sys: {
                id: 'team-id-1',
              },
              displayName: 'Team 1',
            },
          },
        ],
      },
    },
  },
  repliesCollection: {
    items: [
      {
        sys: {
          publishedAt: '2025-04-01T15:00:00.000Z',
        },
        text: 'A new comment',
        createdBy: {
          sys: {
            id: 'user-id-2',
          },
          firstName: 'Jane',
          nickname: 'Jenny',
          lastName: 'Doe',
          alumniSinceDate: null,
          avatar: null,
          teamsCollection: {
            items: [
              {
                team: {
                  sys: {
                    id: 'team-asap',
                  },
                  displayName: 'ASAP',
                },
              },
            ],
          },
        },
      },
    ],
  },
});

export const getManuscriptsListResponse =
  (): ListPartialManuscriptResponse => ({
    total: 2,
    items: [
      {
        id: 'manuscript-id-1',
        manuscriptId: 'ID01-grant-001-org-P-1',
        title: 'Manuscript 1',
        teams: 'Team A',
        apcAmountPaid: undefined,
        assignedUsers: [
          {
            id: 'user-id-1',
            firstName: 'John',
            lastName: 'Doe',
            avatarUrl: 'https://example.com/avatar.png',
          },
        ],
        lastUpdated: '2020-09-23T20:45:22.000Z',
        status: 'Compliant',
        team: {
          id: 'team-1',
          displayName: 'Team A',
        },
      },
      {
        id: 'manuscript-id-2',
        manuscriptId: 'ID01-grant-002-org-P-1',
        title: 'Manuscript 2',
        teams: 'Team A',
        apcAmountPaid: undefined,
        assignedUsers: [
          {
            id: 'user-id-1',
            firstName: 'John',
            lastName: 'Doe',
            avatarUrl: 'https://example.com/avatar.png',
          },
        ],
        lastUpdated: '2020-09-23T20:45:22.000Z',
        status: 'Compliant',
        team: {
          id: 'team-1',
          displayName: 'Team A',
        },
      },
    ],
  });

export const getManuscriptPostBody = (): ManuscriptPostRequest => {
  const { title, teamId, versions } = getManuscriptDataObject();

  const {
    createdBy: __,
    updatedBy: ___,
    createdDate: ____,
    id: _____,
    publishedAt: ______,
    teams: _______,
    count: ________,
    ...version
  } = versions[0]!;
  return {
    title,
    teamId,
    eligibilityReasons: [],
    impact: 'impact-id',
    categories: ['category-id-1'],
    versions: [
      {
        ...version,
        teams: ['team-1'],
        labs: [],
        description: '',
        firstAuthors: [{ userId: 'author-1' }],
        correspondingAuthor: undefined,
        additionalAuthors: [],
        ...getQuickCheckDetailsText(version),
      },
    ],
  };
};

export const getManuscriptCreateControllerDataObject =
  (): ManuscriptCreateControllerDataObject => {
    const { versions, ...rest } = getManuscriptCreateDataObject();

    const { firstAuthors, correspondingAuthor, additionalAuthors, ...version } =
      versions[0]!;

    return {
      ...rest,
      versions: [
        {
          ...version,
          firstAuthors: [{ userId: 'author-1' }],
          correspondingAuthor: undefined,
          additionalAuthors: [],
        },
      ],
    };
  };

export const getManuscriptCreateDataObject = (): ManuscriptCreateDataObject => {
  const { title, teamId, versions } = getManuscriptDataObject();
  const {
    teams: _,
    publishedAt: __,
    createdDate: ___,
    id: ____,
    ...version
  } = versions[0]!;

  return {
    title,
    teamId,
    eligibilityReasons: [],
    impact: 'impact-id',
    categories: ['category-id-1'],
    versions: [
      {
        ...version,
        teams: ['team-1', 'team-2'],
        labs: [],
        description: 'nice description',
        firstAuthors: ['author-1'],
        correspondingAuthor: [],
        additionalAuthors: [],
        ...getQuickCheckDetailsText(version),
      },
    ],
    userId: 'user-id-0',
  };
};

export const getManuscriptUpdateStatusDataObject = (
  overrides?: Partial<ManuscriptUpdateDataObject>,
): ManuscriptUpdateDataObject => {
  return {
    status: 'Manuscript Resubmitted',
    ...overrides,
  };
};

export const getManuscriptUpdateAssignedUsersDataObject = (
  overrides?: Partial<ManuscriptUpdateDataObject>,
): ManuscriptUpdateDataObject => {
  return {
    assignedUsers: ['user-id-1', 'user-id-2'],
    ...overrides,
  };
};

export const getManuscriptUpdateAPCCoverageDataObject = (
  overrides?: Partial<ManuscriptUpdateDataObject>,
): ManuscriptUpdateDataObject => {
  return {
    apcRequested: true,
    apcAmountRequested: 1000,
    apcCoverageRequestStatus: 'paid',
    apcAmountPaid: 1000,
    ...overrides,
  };
};

const getQuickCheckDetailsText = (version: Partial<ManuscriptVersion>) => ({
  acknowledgedGrantNumberDetails: version.acknowledgedGrantNumberDetails,
  asapAffiliationIncludedDetails: version.asapAffiliationIncludedDetails,
  manuscriptLicenseDetails: version.manuscriptLicenseDetails,
  datasetsDepositedDetails: version.datasetsDepositedDetails,
  codeDepositedDetails: version.codeDepositedDetails,
  protocolsDepositedDetails: version.protocolsDepositedDetails,
  labMaterialsRegisteredDetails: version.labMaterialsRegisteredDetails,
  availabilityStatementDetails: version.availabilityStatementDetails,
});
