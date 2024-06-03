import { ManuscriptResponse } from '@asap-hub/model';

export const createManuscriptResponse = (
  itemIndex = 0,
): ManuscriptResponse => ({
  id: `manuscript_${itemIndex}`,
  title: `Manuscript ${itemIndex + 1}`,
  teamId: 'team-1',
  versions: [],
});
