/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable no-console */
import assert from 'assert';
import {
  createClient,
  Environment,
  Entry,
  VersionedLink,
} from 'contentful-management';
import { parseHtml } from 'contentful-html-rich-text-converter';
import { Document } from '@contentful/rich-text-types';

import {
  getAccessTokenFactory,
  SquidexRest,
  RestNews,
} from '@asap-hub/squidex';

type NewsPayload = {
  title: { 'en-US': string };
  shortText: { 'en-US': string | null };
  frequency: { 'en-US': string | null };
  link: { 'en-US': string | undefined };
  linkText: { 'en-US': string | undefined };
  text: { 'en-US': Document | null };
};

const clearContentfulEntries = async (contentfulEnvironment: Environment) => {
  const news = await contentfulEnvironment.getEntries({
    content_type: 'news',
  });
  console.log('Cleaning Contentful Entries...');

  const unpublishPromises: Promise<Entry>[] = [];
  news.items.forEach(async (entry) => {
    if (entry.isPublished()) {
      unpublishPromises.push(entry.unpublish());
    }
  });

  await Promise.all(unpublishPromises);

  const deletePromises: Promise<Entry>[] = [];
  news.items.forEach(async (entry) => {
    deletePromises.push(entry.delete());
    console.log('entry', entry.sys.id, 'deleted');
  });

  await Promise.all(deletePromises);
};

const clearRichText = (htmlDocument: Document) => ({
  ...htmlDocument,
  content: htmlDocument?.content
    .map((node) =>
      node.nodeType === 'unordered-list' || node.nodeType === 'ordered-list'
        ? {
            ...node,
            content: node.content.filter(
              (childNode: { nodeType: string }) =>
                childNode.nodeType === 'list-item',
            ),
          }
        : node,
    )
    // The external lib 'parseHtml' we are using may return
    // an output with incorrect nodeType, that's why
    // we need to overwrite its type to any and filter
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .filter((node: any) => node?.nodeType !== 'text'),
});

const publishEntries = async (
  contentfulEnvironment: Environment,
  entries: Entry[],
) => {
  const payload: VersionedLink<'Entry'>[] = entries.map((entry) => ({
    sys: {
      linkType: 'Entry',
      type: 'Link',
      id: entry.sys.id,
      version: entry.sys.version,
    },
  }));

  const bulkActionInProgress =
    await contentfulEnvironment.createPublishBulkAction({
      entities: {
        sys: { type: 'Array' },
        items: payload,
      },
    });

  const bulkActionCompleted = await bulkActionInProgress.waitProcessing();
  console.log(bulkActionCompleted);
};

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

  const contentfulClient = createClient({
    accessToken: CONTENTFUL_MANAGEMENT_ACCESS_TOKEN!,
  });

  const contentfulSpace = await contentfulClient.getSpace(CONTENTFUL_SPACE_ID!);
  const contentfulEnvironment = await contentfulSpace.getEnvironment(
    CONTENTFUL_ENV_ID!,
  );

  const squidexNews = await squidexNewsClient.fetch();

  await clearContentfulEntries(contentfulEnvironment);

  const problematicNewsIds = [
    // Problematic news: in process of investigating
    // why they give an error
    '37585a46-96e2-4b4d-8d69-925634c0eea9',
    '87088450-5774-438a-ae04-2d0b92915040',
    'a259e8b4-c86e-4818-88ac-bb93015b4159',
    '9ece8d48-ab29-4cd8-9216-421588a38670',
  ];

  const createEntriesPromises: Promise<Entry>[] = [];
  squidexNews.items.forEach(async ({ data: squidexNewsItem, id }) => {
    if (!problematicNewsIds.includes(id)) {
      const { title, shortText, frequency, link, linkText } = squidexNewsItem;

      const newsPayload: NewsPayload = {
        title: { 'en-US': title.iv },
        shortText: { 'en-US': shortText.iv },
        frequency: { 'en-US': frequency?.iv || 'News Articles' },
        link: { 'en-US': link?.iv },
        linkText: { 'en-US': linkText?.iv },
        text: { 'en-US': null },
      };

      if (squidexNewsItem.text.iv) {
        const textWithoutDivTag = squidexNewsItem.text.iv.replace(
          /<[\\/]{0,1}(div)[^><]*>/g,
          '',
        );

        const parsedHtml = parseHtml(textWithoutDivTag) as Document;

        newsPayload.text = {
          'en-US': clearRichText(parsedHtml),
        };
      }

      createEntriesPromises.push(
        contentfulEnvironment.createEntryWithId('news', id, {
          fields: newsPayload,
        }),
      );
    }
  });
  const entries = await Promise.all(createEntriesPromises);
  await publishEntries(contentfulEnvironment, entries);
};

migrateNews();
