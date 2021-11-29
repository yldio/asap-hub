import { ResearchOutputResponse } from '@asap-hub/model';
import {
  createResearchOutputResponse,
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
