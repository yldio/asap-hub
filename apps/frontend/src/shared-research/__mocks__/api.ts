import { EntityRecord, SearchResponse } from '@asap-hub/algolia';
import { ResearchOutputResponse } from '@asap-hub/model';
import { createResearchOutputResponse } from '@asap-hub/fixtures';

import { createResearchOutputListAlgoliaResponse } from '../../__fixtures__/algolia';

export const getResearchOutput = jest.fn(
  async (id: string): Promise<ResearchOutputResponse> => ({
    ...createResearchOutputResponse(),
    id,
  }),
);

export const getResearchOutputs = jest.fn(
  async (): Promise<Partial<SearchResponse<EntityRecord<'research-output'>>>> =>
    createResearchOutputListAlgoliaResponse(2),
);
