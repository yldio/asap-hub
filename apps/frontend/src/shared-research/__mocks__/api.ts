import {
  ListResearchOutputResponse,
  ResearchOutputResponse,
} from '@asap-hub/model';
import {
  createResearchOutputResponse,
  createListResearchOutputResponse,
} from '@asap-hub/fixtures';

export const getResearchOutput = jest.fn(
  async (id: string): Promise<ResearchOutputResponse> => ({
    ...createResearchOutputResponse(),
    id,
  }),
);

export const getResearchOutputs = jest.fn(
  async (): Promise<ListResearchOutputResponse> => ({
    ...createListResearchOutputResponse(2),
  }),
);
