import { gp2 } from '@asap-hub/model';

export const mockedTags: gp2.TagResponse[] = [
  { id: '7', name: 'Keyword-7' },
  { id: '11', name: 'Keyword-11' },
  { id: '23', name: 'Keyword-23' },
];

export const createTagsResponse = (): gp2.ListTagsResponse => ({
  items: mockedTags,
  total: 3,
});
