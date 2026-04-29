import {
  FetchComplianceManuscriptVersionsQuery,
  FetchVersionsByManuscriptQuery,
  Projects,
} from '@asap-hub/contentful';
import {
  ListManuscriptVersionExportResponse,
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

export const getManuscriptVersionExportResponse =
  (): ListManuscriptVersionExportResponse => ({
    total: 2,
    items: [
      {
        id: 'mv-manuscript-id-1',
        title: 'Manuscript 1',
        manuscriptId: 'WH1-000282-001-org-P-2',
        type: 'Original Research',
        lifecycle: 'Preprint',

        manuscriptFile: 'file-url-1',
        keyResourceTable: 'key-resource-url',
        additionalFiles: 'file1.pdf, file2.pdf',

        preprintDoi: '10.0001/preprint',
        publicationDoi: '10.0001/paper',
        otherDetails: 'Other details',
        description: 'Full description',
        shortDescription: 'Short description',

        impact: 'Impact One',
        categories: 'Category One',
        mainProject: 'Project One',
        teams: 'Team One',

        status: 'Published',

        apcRequested: 'true',
        apcAmountRequested: '1000',
        apcCoverageRequestStatus: 'Approved',
        apcAmountPaid: '800',

        declinedReason: '',
        acknowledgedGrantNumber: 'GR-123',
        acknowledgedGrantNumberDetails: 'Details',
        asapAffiliationIncluded: 'Yes',
        asapAffiliationIncludedDetails: 'Details',

        manuscriptLicense: 'CC-BY',
        manuscriptLicenseDetails: 'License details',

        datasetsDeposited: 'Yes',
        datasetsDepositedDetails: 'Dataset details',
        codeDeposited: 'Yes',
        codeDepositedDetails: 'Code details',
        protocolsDeposited: 'No',
        protocolsDepositedDetails: '',

        labMaterialsRegistered: 'Yes',
        labMaterialsRegisteredDetails: 'Lab details',

        availabilityStatement: 'Available',
        availabilityStatementDetails: 'Statement details',

        firstAuthors: 'First (one) Author, External Author',
        correspondingAuthor: 'First Author',
        additionalAuthors: 'External Author',
        assignedUsers: 'User One',
        labs: 'Lab One',

        complianceReportUrl: 'http://compliance-report.com',
        complianceReportDescription: 'Compliance report',

        versionLastUpdatedDate: '2026-01-01T00:00:00Z',
      },
      {
        id: 'mv-manuscript-id-2',
        title: 'Manuscript 2',
        manuscriptId: 'WH1-000282-002-org-P-2',
        type: 'Original Research',
        lifecycle: 'Preprint',

        manuscriptFile: 'file-url-2',
        description: 'Full description 2',
        shortDescription: 'Short description 2',

        mainProject: 'Project One',
        teams: 'Team One',
        status: 'Published',

        firstAuthors: 'First (one) Author, External Author',
        labs: 'Lab One',

        versionLastUpdatedDate: '2026-01-01T00:00:00Z',
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

export const getContentfulManuscriptVersionFull = (
  count: number = 1,
  project?: NonNullable<
    NonNullable<
      NonNullable<ComplianceVersion['linkedFrom']>['manuscriptsCollection']
    >['items'][number]
  >['project'],
): ComplianceVersion => ({
  sys: {
    id: `version-id-${count}`,
    publishedAt: '2026-01-01T00:00:00Z',
  },

  type: 'Original Research',
  lifecycle: 'Preprint',
  count,

  url: 'http://example.com',

  preprintDoi: '10.1234/preprint',
  publicationDoi: '10.1234/publication',
  otherDetails: 'Some extra details',

  manuscriptFile: { url: 'http://file.com/manuscript.pdf' },
  keyResourceTable: { url: 'http://file.com/table.pdf' },

  additionalFilesCollection: {
    items: [
      { url: 'http://file.com/extra1.pdf' },
      { url: 'http://file.com/extra2.pdf' },
    ],
  },

  description: 'Full description',
  shortDescription: 'Short desc',

  acknowledgedGrantNumber: 'GRANT-123',
  acknowledgedGrantNumberDetails: 'Grant details',

  asapAffiliationIncluded: 'Yes',
  asapAffiliationIncludedDetails: 'Affiliation details',

  availabilityStatement: 'Available',
  availabilityStatementDetails: 'Availability details',

  codeDeposited: 'Yes',
  codeDepositedDetails: 'Code details',

  datasetsDeposited: 'No',
  datasetsDepositedDetails: 'Dataset details',

  labMaterialsRegistered: 'Yes',
  labMaterialsRegisteredDetails: 'Lab materials details',

  protocolsDeposited: 'Yes',
  protocolsDepositedDetails: 'Protocols details',

  manuscriptLicense: 'CC-BY',
  manuscriptLicenseDetails: 'License details',

  firstAuthorsCollection: {
    items: [
      {
        __typename: 'Users',
        firstName: 'First',
        lastName: 'Author',
        middleName: '',
        nickname: 'FA',
      },
    ],
  },

  correspondingAuthorCollection: {
    items: [
      {
        __typename: 'Users',
        firstName: 'Corr',
        lastName: 'Author',
        middleName: '',
        nickname: 'CA',
      },
    ],
  },

  additionalAuthorsCollection: {
    items: [
      {
        __typename: 'Users',
        firstName: 'Add',
        lastName: 'Author',
        middleName: '',
        nickname: 'AA',
      },
    ],
  },

  labsCollection: {
    items: [
      {
        name: 'Lab One',
      },
    ],
  },

  teamsCollection: {
    items: [
      {
        displayName: 'Team A',
      },
    ],
  },
  linkedFrom: {
    manuscriptsCollection: {
      items: [
        {
          title: 'Manuscript Title',
          url: 'http://manuscript.com',
          status: 'Published',
          teamsCollection: {
            items: [
              {
                linkedFrom: {
                  projectMembershipCollection: {
                    items: [
                      {
                        linkedFrom: {
                          projectsCollection: {
                            items: [
                              {
                                projectId: 'P-TEAM-1',
                                grantId: 'G-TEAM-1',
                                title: 'Team Project',
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
          categoriesCollection: {
            items: [{ name: 'Neuroscience' }],
          },
          apcAmountRequested: 100,
          apcAmountPaid: 100,
          assignedUsersCollection: {
            items: [
              {
                firstName: 'Jane',
                lastName: 'Doe',
                middleName: '',
                nickname: 'JD',
              },
            ],
          },
          project,
        },
      ],
    },

    complianceReportsCollection: {
      items: [
        {
          description: 'Compliance report',
          url: 'http://report.com',
        },
      ],
    },
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
type ComplianceVersion = NonNullable<
  NonNullable<
    NonNullable<FetchComplianceManuscriptVersionsQuery>['manuscriptVersionsCollection']
  >['items'][number]
>;

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
