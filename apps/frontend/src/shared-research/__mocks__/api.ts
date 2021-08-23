import {
  ListResearchOutputResponse,
  ResearchOutputResponse,
} from '@asap-hub/model';
import {
  createResearchOutputResponse,
  createListResearchOutputResponse,
  createAlgoliaResearchOutputResponse,
} from '@asap-hub/fixtures';

import { SearchResponse } from '@algolia/client-search';

export const getResearchOutput = jest.fn(
  async (id: string): Promise<ResearchOutputResponse> => ({
    ...createResearchOutputResponse(),
    id,
  }),
);

export const getResearchOutputs = jest.fn(
  async (): Promise<Partial<SearchResponse<ResearchOutputResponse>>> =>
    createAlgoliaResearchOutputResponse(2),
);

export const getResearchOutputsLegacy = jest.fn(
  async (): Promise<ListResearchOutputResponse> =>
    createListResearchOutputResponse(2),
);
