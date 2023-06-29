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
  items: [
    {
      title: 'Item 1',
    },
    {
      title: 'Item 2',
    },
  ],
});
