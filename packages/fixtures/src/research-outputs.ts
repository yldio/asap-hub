import { ListResearchOutputResponse } from '@asap-hub/model';

const listResearchOutputResponseItem: Omit<
  ListResearchOutputResponse['items'][0],
  'id'
> = {
  created: '2020-09-07T17:36:54Z',
  publishDate: '2020-09-07T17:36:54Z',
  title: 'Output',
  text: 'description',
  type: 'Proposal',
  url: 'test',
  team: {
    id: 'e12729e0-a244-471f-a554-7b58eae83a8d',
    displayName: 'Jakobsson, J',
  },
};

export const createListResearchOutputResponse = (
  items: number,
): ListResearchOutputResponse => ({
  total: items,
  items: Array.from({ length: items }, (_, itemIndex) => ({
    ...listResearchOutputResponseItem,
    id: `ro${itemIndex}`,
    title: `${listResearchOutputResponseItem.title} ${itemIndex + 1}`,
  })),
});

export default createListResearchOutputResponse;
