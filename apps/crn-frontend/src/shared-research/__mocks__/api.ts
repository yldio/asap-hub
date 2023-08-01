import { ClientSearchResponse } from '@asap-hub/algolia';
import {
  createListResearchOutputResponse,
  createResearchOutputResponse,
  researchTagsResponse,
} from '@asap-hub/fixtures';
import {
  ListResearchOutputResponse,
  ResearchOutputResponse,
} from '@asap-hub/model';

import { createResearchOutputListAlgoliaResponse } from '../../__fixtures__/algolia';

type SearchResponse = ClientSearchResponse<'crn', 'research-output'>;

export const getResearchOutput = jest.fn(
  async (id: string): Promise<ResearchOutputResponse> => ({
    ...createResearchOutputResponse(),
    id,
  }),
);

export const getResearchOutputs = jest.fn(
  async (): Promise<Partial<SearchResponse>> =>
    createResearchOutputListAlgoliaResponse(2),
);

export const getDraftResearchOutputs = jest.fn(
  async (): Promise<ListResearchOutputResponse> =>
    createListResearchOutputResponse(2),
);
export const getResearchTags = jest.fn(async () => researchTagsResponse);
