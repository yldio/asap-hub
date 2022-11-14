import assert from 'assert';
import * as contentful from 'contentful-management';
import { parseHtml } from 'contentful-html-rich-text-converter';

import {
  getAccessTokenFactory,
  SquidexRest,
  RestNews,
} from '@asap-hub/squidex';

const migrateNews = async () => {
  [
    'CONTENTFUL_MANAGEMENT_ACCESS_TOKEN',
    'CONTENTFUL_SPACE_ID',
    'CONTENTFUL_ENV_ID',
    'CRN_SQUIDEX_APP_NAME',
    'CRN_SQUIDEX_CLIENT_ID',
    'CRN_SQUIDEX_CLIENT_SECRET',
    'SQUIDEX_BASE_URL',
  ].forEach((env) => {
    assert.ok(process.env[env], `${env} not defined`);
  });

  const {
    CONTENTFUL_MANAGEMENT_ACCESS_TOKEN,
    CONTENTFUL_SPACE_ID,
    CONTENTFUL_ENV_ID,
    CRN_SQUIDEX_APP_NAME,
    CRN_SQUIDEX_CLIENT_ID,
    CRN_SQUIDEX_CLIENT_SECRET,
    SQUIDEX_BASE_URL,
  } = process.env;

  const getAuthToken = getAccessTokenFactory({
    clientId: CRN_SQUIDEX_CLIENT_ID!,
    clientSecret: CRN_SQUIDEX_CLIENT_SECRET!,
    baseUrl: SQUIDEX_BASE_URL!,
  });

  const squidexNewsClient = new SquidexRest<RestNews>(
    getAuthToken,
    'news-and-events',
    { appName: CRN_SQUIDEX_APP_NAME!, baseUrl: SQUIDEX_BASE_URL! },
  );

  const contentfulClient = contentful.createClient({
    accessToken: CONTENTFUL_MANAGEMENT_ACCESS_TOKEN!,
  });

  const contentfulSpace = await contentfulClient.getSpace(CONTENTFUL_SPACE_ID!);
  const contentfulEnvironment = await contentfulSpace.getEnvironment(
    CONTENTFUL_ENV_ID!,
  );

  const squidexNews = await squidexNewsClient.fetch();

  const newsFields = [
    'title',
    'frequency',
    'link',
    'linkText',
    'shortText',
    // 'thumbnail', // TODO: deal with thumbnail
  ];

  const firstNews = squidexNews.items[0];

  [firstNews!].forEach(async ({ data, id }) => {
    await contentfulEnvironment
      .getEntry(id)
      .then((entry) => entry.unpublish())
      .then((entry) => entry.delete())
      .then(() => console.log(`Entry deleted.`))
      .catch(console.error);

    const news = Object.entries(data).reduce(
      (news: { [field: string]: { 'en-US': any } }, [key, val]) => {
        if (newsFields.includes(key)) {
          news[key] = { 'en-US': val?.iv };
        } else if (key === 'text') {
          news.text = { 'en-US': parseHtml(val?.iv as string) };
        }

        return news;
      },
      {},
    );

    if (!news.frequency) {
      news.frequency = { 'en-US': 'News Articles' };
    }
    news.text!['en-US']!.content = news.text?.['en-US']?.content.filter(
      (recd: any) => recd.nodeType !== 'text',
    );

    const entry = await contentfulEnvironment.createEntryWithId('news', id, {
      fields: news,
    });
    await entry.publish();
  });
};

migrateNews();
