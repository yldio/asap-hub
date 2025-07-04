import {
  ComplianceReportDataObject,
  ManuscriptResponse,
  PartialManuscriptResponse,
} from '@asap-hub/model';

export const manuscriptAuthor: ManuscriptResponse['versions'][number]['createdBy'] =
  {
    id: 'user-id',
    displayName: 'John (Tim) Doe',
    firstName: 'John',
    lastName: 'Doe',
    alumniSinceDate: undefined,
    avatarUrl: 'http://image',
    teams: [
      {
        id: 'team-id-0',
        name: 'Team A',
      },
    ],
  };

export const createManuscriptResponse = (
  itemIndex = 0,
): ManuscriptResponse => ({
  id: `manuscript_${itemIndex}`,
  title: `Manuscript ${itemIndex + 1}`,
  teamId: 'team-1',
  status: 'Waiting for Report',
  count: 1,
  assignedUsers: [],
  discussions: [],
  versions: [
    {
      id: 'version-1',
      lifecycle: 'Draft Manuscript (prior to Publication)',
      type: 'Original Research',
      description: 'A good description',
      shortDescription: 'A good short description',
      count: 1,
      createdBy: manuscriptAuthor,
      updatedBy: manuscriptAuthor,
      createdDate: '2020-12-10T20:36:54.000Z',
      publishedAt: '2020-12-10T20:36:54.000Z',
      manuscriptFile: {
        id: `file-id-${itemIndex}`,
        url: `https://example.com/manuscript_${itemIndex}.pdf`,
        filename: `manuscript_${itemIndex}.pdf`,
      },
      keyResourceTable: {
        id: `file-resource-table-id-${itemIndex}`,
        url: `https://example.com/manuscript_${itemIndex}.csv`,
        filename: `manuscript_${itemIndex}.csv`,
      },
      additionalFiles: [],
      teams: [
        {
          id: 'team-1',
          displayName: 'Team 1',
          inactiveSince: undefined,
        },
        {
          id: 'team-2',
          displayName: 'Team 2',
          inactiveSince: undefined,
        },
      ],
      labs: [{ name: 'Lab 1', id: 'lab-1' }],
      firstAuthors: [],
      correspondingAuthor: [],
      additionalAuthors: [],
    },
  ],
});

export const getComplianceReportDataObject =
  (): ComplianceReportDataObject => ({
    url: 'http://example.com',
    description: 'compliance report description',
    count: 1,
    createdBy: manuscriptAuthor,
    createdDate: '2020-09-23T20:45:22.000Z',
  });

export const createPartialManuscriptResponse =
  (): PartialManuscriptResponse => ({
    id: 'manuscript-1',
    manuscriptId: 'DA1-000463-003-org-G-1',
    title: 'Manuscript 1',
    teams: 'Team 1',
    lastUpdated: '2020-09-23T20:45:22.000Z',
    team: {
      id: 'team-id-1',
      displayName: 'Team 1',
    },
    status: 'Compliant',
    assignedUsers: [],
  });
