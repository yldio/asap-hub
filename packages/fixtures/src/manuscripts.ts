import { ManuscriptResponse } from '@asap-hub/model';

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
  versions: [
    {
      id: 'version-1',
      lifecycle: 'Draft Manuscript (prior to Publication)',
      type: 'Original Research',
      description: 'A good description',
      count: 1,
      createdBy: manuscriptAuthor,
      updatedBy: manuscriptAuthor,
      createdDate: '2020-12-10T20:36:54Z',
      publishedAt: '2020-12-10T20:36:54Z',
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
