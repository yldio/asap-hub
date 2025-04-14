import { PartialManuscriptResponse } from '@asap-hub/model';

import { manuscriptToCSV } from '../export';

describe('manuscriptToCSV', () => {
  it('exports a manuscript', () => {
    const manuscript: PartialManuscriptResponse = {
      id: 'manuscript-id',
      lastUpdated: '2025-03-06T17:03:41.824Z',
      status: 'Waiting for Report',
      requestingApcCoverage: 'Yes',
      title: 'Contextual AI models for single-cell protein biology Revised',
      assignedUsers: [
        {
          avatarUrl: '',
          firstName: 'Jane',
          lastName: 'Smith',
          id: 'jane-smith',
        },
        {
          avatarUrl: '',
          firstName: 'John',
          lastName: 'Doe',
          id: 'john-doe',
        },
      ],
      team: {
        id: 'alessi',
        displayName: 'Alessi',
      },
      teams: 'Alessi and Camel',
      manuscriptId: 'DA1-000463-005-org-G-1',
    };
    expect(manuscriptToCSV(manuscript)).toEqual({
      'Manuscript ID': 'DA1-000463-005-org-G-1',
      Title: 'Contextual AI models for single-cell protein biology Revised',
      'Team Name': 'Alessi',
      'Last Updated': '2025-03-06T17:03:41.824Z',
      Status: 'Waiting for Report',
      'Requested APC Coverage': 'Yes',
      'Assigned Users': 'Jane Smith, John Doe',
      'All Teams': 'Alessi and Camel',
    });
  });
});
