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
  versions: [
    {
      lifecycle: 'Draft manuscript (prior to preprint submission)',
      type: 'Original Research',
      createdBy: manuscriptAuthor,
      publishedAt: '2020-12-10T20:36:54Z',
      manuscriptFile: {
        id: `file-id-${itemIndex}`,
        url: `https://example.com/manuscript_${itemIndex}.pdf`,
        filename: `manuscript_${itemIndex}.pdf`,
      },
    },
  ],
});
