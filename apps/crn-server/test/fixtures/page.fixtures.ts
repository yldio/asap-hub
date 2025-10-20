import { FetchPagesQuery } from '@asap-hub/contentful';
import { PageResponse } from '@asap-hub/model';

export const pageResponse: PageResponse = {
  id: 'some-id',
  path: '/privacy-notice',
  shortText: 'short text',
  text: '<h1>Privacy Notice</h1>',
  title: 'Privacy Notice',
  link: 'link',
  linkText: 'linkText',
};

export const getContentfulPagesGraphqlResponse = (): FetchPagesQuery => ({
  pagesCollection: {
    total: 1,
    items: [getContentfulGraphqlPages()],
  },
});

export const getContentfulGraphqlPages = (): NonNullable<
  NonNullable<FetchPagesQuery['pagesCollection']>['items'][number]
> => ({
  sys: {
    id: 'some-id',
  },
  title: 'Privacy Notice',
  path: '/privacy-notice',
  shortText: 'short text',
  link: 'link',
  linkText: 'linkText',
  text: {
    json: {
      nodeType: 'document',
      data: {},
      content: [
        {
          nodeType: 'heading-1',
          data: {},
          content: [
            {
              nodeType: 'text',
              value: 'Privacy Notice',
              marks: [],
              data: {},
            },
          ],
        },
      ],
    },
    links: {
      entries: {
        inline: [],
      },
      assets: {
        block: [],
      },
    },
  },
});
