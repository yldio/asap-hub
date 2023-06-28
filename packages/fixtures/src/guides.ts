import { GuideResponse, ListGuideResponse } from '@asap-hub/model';

export const createGuides = ({
  guides = 1,
}: {
  guides?: number;
}): GuideResponse[] =>
  Array.from({ length: guides }, (_, index) => ({
    id: `l${index}`,
    title: `Example ${index + 1}`,
    content: [
      {
        title: '',
        linkText: `example link ${index + 1}`,
        linkUrl: 'https://example.com',
        text: `Example text ${index + 1}`,
      },
    ],
  }));

export const createListGuidesResponse = (items: number): ListGuideResponse => ({
  total: items,
  items: createGuides({ guides: items }),
});
