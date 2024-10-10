import { FetchManuscriptByIdQuery } from '@asap-hub/contentful';
import { manuscriptAuthor } from '@asap-hub/fixtures';
import {
  ManuscriptCreateControllerDataObject,
  ManuscriptCreateDataObject,
  ManuscriptDataObject,
  ManuscriptFileResponse,
  ManuscriptPostRequest,
  ManuscriptResponse,
} from '@asap-hub/model';

export const getManuscriptDataObject = (
  data: Partial<ManuscriptDataObject> = {},
): ManuscriptDataObject => ({
  id: 'manuscript-id-1',
  title: 'Manuscript Title',
  teamId: 'team-1',
  versions: [
    {
      id: 'version-1',
      lifecycle: 'Preprint',
      type: 'Original Research',
      createdBy: manuscriptAuthor,
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

export const getContentfulGraphqlManuscript = (
  props: Partial<
    NonNullable<NonNullable<FetchManuscriptByIdQuery>['manuscripts']>
  > = {},
): NonNullable<NonNullable<FetchManuscriptByIdQuery>['manuscripts']> => ({
  sys: {
    id: 'manuscript-id-1',
  },
  title: 'Manuscript Title',
  teamsCollection: {
    items: [{ sys: { id: 'team-1' } }],
  },
  versionsCollection: getContentfulGraphqlManuscriptVersions(),
  ...props,
});

export const getContentfulGraphqlManuscriptVersions: () => NonNullable<
  NonNullable<
    NonNullable<FetchManuscriptByIdQuery>['manuscripts']
  >['versionsCollection']
> = () => ({
  items: [
    {
      sys: {
        id: 'version-1',
        publishedAt: '2020-09-23T20:45:22.000Z',
        firstPublishedAt: '2020-09-23T20:45:22.000Z',
      },
      type: 'Original Research',
      lifecycle: 'Preprint',
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
            sys: { id: 'team-1' },
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
    },
  ],
});

export const getManuscriptPostBody = (): ManuscriptPostRequest => {
  const { title, teamId, versions } = getManuscriptDataObject();

  const {
    createdBy: _,
    createdDate: __,
    id: ___,
    publishedAt: ____,
    teams: _____,
    ...version
  } = versions[0]!;
  return {
    title,
    teamId,
    eligibilityReasons: [],
    versions: [
      {
        ...version,
        teams: ['team-1'],
        labs: [],
        description: '',
        firstAuthors: [{ userId: 'author-1' }],
        correspondingAuthor: undefined,
        additionalAuthors: [],
        submissionDate: undefined,
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
    ...version
  } = versions[0]!;

  return {
    title,
    teamId,
    eligibilityReasons: [],
    versions: [
      {
        ...version,
        teams: ['team-1'],
        labs: [],
        description: 'nice description',
        firstAuthors: ['author-1'],
        correspondingAuthor: [],
        additionalAuthors: [],
        submissionDate: undefined,
      },
    ],
    userId: 'user-id-0',
  };
};
