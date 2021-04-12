import {
  ListResearchOutputResponse,
  ResearchOutputResponse,
} from '@asap-hub/model';

const researchOutputResponse: Omit<
  ListResearchOutputResponse['items'][0],
  'id'
> = {
  created: '2020-09-07T17:36:54Z',
  publishDate: '2020-09-07T17:36:54Z',
  title: 'Output',
  text: 'description',
  type: 'Proposal',
  tags: ['test', 'tag'],
  team: {
    id: 'e12729e0-a244-471f-a554-7b58eae83a8d',
    displayName: 'Jakobsson, J',
  },
};

export const createResearchOutputResponse = (
  itemIndex = 0,
): ResearchOutputResponse => ({
  ...researchOutputResponse,
  id: `ro${itemIndex}`,
  title: `${researchOutputResponse.title} ${itemIndex + 1}`,
});

export const createListResearchOutputResponse = (
  items: number,
): ListResearchOutputResponse => ({
  total: items,
  items: Array.from({ length: items }, (_, itemIndex) =>
    createResearchOutputResponse(itemIndex),
  ),
});

export default createListResearchOutputResponse;
