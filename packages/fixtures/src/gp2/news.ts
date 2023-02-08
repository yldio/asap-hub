import { gp2 } from '@asap-hub/model';

const mockedNews: gp2.NewsResponse = {
  articleCount: 31,
  cohortCount: 12,
  created: '2023-02-02T14:38:42.000Z',
  id: '9bce95a3-b5d7-436d-81ed-297089a1b7a3',
  link: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  linkText: 'Read More',
  sampleCount: 32131,
  shortText: 'this is another news item',
  title: 'Another news',
};

export const createNewsResponse = (
  items = [mockedNews],
): gp2.ListNewsResponse => ({
  items,
  total: items.length,
});
