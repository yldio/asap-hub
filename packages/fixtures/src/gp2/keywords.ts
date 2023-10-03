import { gp2 } from '@asap-hub/model';

export const mockedKeywords: gp2.KeywordResponse[] = [
  { id: '7', name: 'Keyword-7' },
  { id: '11', name: 'Keyword-11' },
  { id: '23', name: 'Keyword-23' },
];

export const createKeywordsResponse = (): gp2.ListKeywordsResponse => ({
  items: mockedKeywords,
  total: 3,
});
