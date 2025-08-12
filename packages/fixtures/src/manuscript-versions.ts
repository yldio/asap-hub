import { ManuscriptVersionResponse } from '@asap-hub/model';

export const createManuscriptVersionResponse =
  (): ManuscriptVersionResponse => ({
    id: 'mv-manuscript-1',
    manuscriptId: 'DA1-000463-003-org-G-1',
    versionId: 'version-id-1',
    title: 'Manuscript 1',
    teamId: 'team-id-1',
    type: 'Original Research',
    lifecycle: 'Preprint',
    url: 'http://example.com',
  });
