import { GuideResponse, ListGuideResponse } from '@asap-hub/model';

export const getGuideDataObject = (): GuideResponse => ({
  title: `Example Guide`,
  content: [
    {
      title: '',
      linkText: `example link`,
      linkUrl: 'https://example.com',
      text: `Example text`,
    },
  ],
});

export const getGuidesResponse = (): ListGuideResponse => ({
  total: 1,
  items: [getGuideDataObject()],
});

export const getContentfulGraphqlGuides = () => ({
  title: 'Item 1',
  contentCollection: {
    items: [
      {
        sys: { id: 'guide-content-id-0' },
      },
    ],
  },
});

export const getContentfulGraphqlGuideContent = () => ({
  sys: {
    id: 'guide-content-id-0',
  },
  title: '',
  text: 'guide content text',
  linkUrl: 'https://example.com',
  linkText: 'link text',
});

export const getContentfulGraphql = () => ({
  Guides: () => getContentfulGraphqlGuides(),
  GuidesCollection: () => ({
    total: 1,
    items: [{}],
  }),
  GuideContent: () => getContentfulGraphqlGuideContent(),
  GuideContentCollection: () => ({
    total: 1,
    items: [{}],
  }),
});
