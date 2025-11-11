import { FetchVersionsByManuscriptQuery, Projects } from '@asap-hub/contentful';
import {
  ListManuscriptVersionResponse,
  ManuscriptVersionDataObject,
} from '@asap-hub/model';

export const getManuscriptVersionsListResponse =
  (): ListManuscriptVersionResponse => ({
    total: 2,
    items: [
      {
        id: 'mv-manuscript-id-1',
        hasLinkedResearchOutput: true,
        type: 'Original Research',
        lifecycle: 'Preprint',
        teamId: 'team-id-1',
        manuscriptId: 'WH1-000282-001-org-P-2',
        impact: { id: 'impact-id-1', name: 'Impact One' },
        categories: [{ id: 'category-id-1', name: 'Category One' }],
        authors: [
          {
            id: 'first-author-1',
            firstName: 'First',
            lastName: 'Author',
            email: 'author1@gmail.com',
            displayName: 'First (one) Author',
          },
          { id: 'external-author-1', displayName: 'External Author' },
        ],
        labs: [{ id: 'lab-id-1', name: 'Lab One' }],
        title: 'Manuscript 1',
        versionId: 'version-id-2',
        url: 'http://example.com',
      },
      {
        id: 'mv-manuscript-id-2',
        hasLinkedResearchOutput: true,
        type: 'Original Research',
        lifecycle: 'Preprint',
        teamId: 'team-id-1',
        manuscriptId: 'WH1-000282-002-org-P-2',
        impact: { id: 'impact-id-1', name: 'Impact One' },
        categories: [{ id: 'category-id-1', name: 'Category One' }],
        authors: [
          {
            id: 'first-author-1',
            firstName: 'First',
            lastName: 'Author',
            email: 'author1@gmail.com',
            displayName: 'First (one) Author',
          },
          { id: 'external-author-1', displayName: 'External Author' },
        ],
        labs: [{ id: 'lab-id-1', name: 'Lab One' }],
        title: 'Manuscript 2',
        versionId: 'version-id-2',
        url: 'http://example.com',
      },
    ],
  });

export const getManuscriptVersionDataObject =
  (): ManuscriptVersionDataObject => ({
    versionFound: true,
    latestManuscriptVersion: {
      id: 'mv-manuscript-id-1',
      hasLinkedResearchOutput: true,
      lifecycle: 'Preprint',
      teamId: 'team-id-1',
      title: 'Manuscript 1',
      manuscriptId: 'WH1-000282-001-org-P-2',
      versionId: 'version-id-2',
      url: 'http://example.com',
    },
  });

export const getContentfulManuscriptVersion = (
  count: number = 1,
  lifecycle: string = 'Preprint',
): Version => ({
  sys: {
    id: `version-id-${count}`,
  },
  type: 'Original Research',
  lifecycle,
  count,
  url: 'http://example.com',
  firstAuthorsCollection: {
    items: [
      {
        __typename: 'Users',
        sys: {
          id: 'first-author-1',
        },
        firstName: 'First',
        lastName: 'Author',
        email: 'author1@gmail.com',
        nickname: 'one',
      },
      {
        __typename: 'ExternalAuthors',
        sys: {
          id: 'external-author-1',
        },
        name: 'External Author',
      },
    ],
  },
  labsCollection: {
    items: [
      {
        sys: {
          id: 'lab-id-1',
        },
        name: 'Lab One',
      },
    ],
  },
});

type VersionCollection = NonNullable<
  NonNullable<
    NonNullable<
      NonNullable<
        NonNullable<FetchVersionsByManuscriptQuery>['manuscriptsCollection']
      >['items'][number]
    >
  >['versionsCollection']
>['items'];

export type Version = VersionCollection[number];

export const getContentfulManuscript = (
  count: number = 1,
  versionCollection: VersionCollection = [
    getContentfulManuscriptVersion(2),
    getContentfulManuscriptVersion(),
  ],
): NonNullable<
  NonNullable<
    NonNullable<FetchVersionsByManuscriptQuery>['manuscriptsCollection']
  >['items'][number]
> => ({
  sys: { id: `manuscript-id-${count}` },
  count,
  title: `Manuscript ${count}`,
  url: 'http://example.com',
  impact: {
    sys: {
      id: 'impact-id-1',
    },
    name: 'Impact One',
  },
  categoriesCollection: {
    items: [
      {
        sys: {
          id: 'category-id-1',
        },
        name: 'Category One',
      },
    ],
  },
  teamsCollection: {
    items: [
      {
        sys: { id: 'team-id-1' },
        linkedFrom: {
          projectMembershipCollection: {
            items: [
              {
                linkedFrom: {
                  projectsCollection: {
                    items: [
                      {
                        projectId: 'WH1',
                        grantId: '000282',
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
    items: versionCollection,
  },
});

export const getContentfulManuscriptsCollection =
  (): NonNullable<FetchVersionsByManuscriptQuery>['manuscriptsCollection'] => ({
    items: [getContentfulManuscript(), getContentfulManuscript(2)],
    total: 2,
  });

export const getContentfulManuscriptProjectsCollection = (): {
  items: Array<Pick<Projects, 'projectId' | 'grantId'>>;
} => ({
  items: [
    {
      projectId: 'WH1',
      grantId: '000282',
    },
  ],
});
