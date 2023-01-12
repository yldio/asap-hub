import { NewsType, NewsResponse, ListNewsResponse } from '@asap-hub/model';

type FixtureOptions = {
  key: string | number;
  type?: NewsType;
};

export const createNewsResponse = ({ key }: FixtureOptions): NewsResponse => ({
  id: `uuid-${key}`,
  title: `${key} title`,
  shortText: `${key} short text`,
  text: `<h1>${key} text</h1>`,
  created: new Date().toISOString(),
});

export const createNewsResponseWithType = ({
  key,
  type = 'News',
}: FixtureOptions): NewsResponse & { type: NewsType } => ({
  id: `uuid-${type}-${key}`,
  title: `${type} ${key} title`,
  shortText: `${type} ${key} short text`,
  text: `<h1>${type} ${key} text</h1>`,
  created: new Date().toISOString(),
  type,
});

export const createListNewsResponse = (
  items = 10,
  total = 10,
): ListNewsResponse => ({
  total,
  items: Array.from({ length: items }, (_, idx) => ({
    ...createNewsResponse({ key: idx + 1 }),
    title: 'News Item',
  })),
});

export default createNewsResponse;
