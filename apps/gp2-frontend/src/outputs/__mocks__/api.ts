import {
  gp2 as gp2Model,
  OutputGenerateContentResponse,
} from '@asap-hub/model';
import { gp2 as gp2Fixtures } from '@asap-hub/fixtures';

export const getOutput = jest.fn(
  async (id: string): Promise<gp2Model.OutputResponse> => ({
    ...gp2Fixtures.createOutputResponse(),
    id,
  }),
);

export const getOutputs = jest.fn(
  async (): Promise<gp2Model.ListOutputResponse> =>
    gp2Fixtures.createListOutputResponse(2),
);

export const createOutput = jest.fn(
  async ({
    title,
    documentType,
  }: gp2Model.OutputPostRequest): Promise<gp2Model.OutputResponse> => ({
    ...gp2Fixtures.createOutputResponse(),
    title,
    documentType,
  }),
);
export const updateOutput = jest.fn(
  async ({
    title,
    documentType,
  }: gp2Model.OutputPutRequest): Promise<gp2Model.OutputResponse> => ({
    ...gp2Fixtures.createOutputResponse(),
    title,
    documentType,
  }),
);

export const getGeneratedOutputContent = jest.fn(
  async (): Promise<OutputGenerateContentResponse> => ({
    shortDescription: 'summarised short description',
  }),
);
