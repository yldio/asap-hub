import { gp2 as gp2Model } from '@asap-hub/model';
import { gp2 as gp2Fixtures } from '@asap-hub/fixtures';

export const getOutput = jest.fn(
  async (id: string): Promise<gp2Model.OutputResponse> => ({
    ...gp2Fixtures.createOutputResponse(),
    id,
  }),
);

export const getOutputs = jest.fn(
  async (): Promise<gp2Model.ListOutputResponse> => ({
    ...gp2Fixtures.createListOutputResponse(2),
  }),
);
