import {
  ResearchOutput,
  RestResearchOutput,
  SquidexRest,
} from '@asap-hub/squidex';
import { appName, baseUrl } from '../../src/config';
import { getAuthToken } from '../../src/utils/auth';

const researchOutputs = new SquidexRest<RestResearchOutput>(
  getAuthToken,
  'research-outputs',
  { appName, baseUrl },
);

export const createResearchOutput = (
  overwrites?: Partial<ResearchOutput>,
): Promise<RestResearchOutput> => {
  const researchOutputData: Partial<ResearchOutput> = {
    documentType: 'Article',
    title: 'Research Output',
    description: 'Description',
    sharingStatus: 'Network Only',
    asapFunded: 'Not Sure',
    usedInAPublication: 'Not Sure',
    ...overwrites,
  };

  const researchOutput = Object.entries(researchOutputData).reduce(
    (acc, [key, value]) => {
      acc[key] = { iv: value };
      return acc;
    },
    {} as { [key: string]: { iv: unknown } },
  );

  return researchOutputs.create(researchOutput as RestResearchOutput['data']);
};
