import { gp2 } from '@asap-hub/model';

export const mockedKeywords: gp2.KeywordResponse[] = [
  { id: '1', name: 'Keyword-1' },
  { id: '2', name: 'Keyword-2' },
  { id: '3', name: 'Keyword-3' },
];

export const createKeywordsResponse = (): gp2.ListKeywordsResponse => ({
  items: mockedKeywords,
  total: 3,
});
