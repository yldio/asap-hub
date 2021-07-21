import { Squidex, ResearchOutput, RestResearchOutput } from '@asap-hub/squidex';

const researchOutputs = new Squidex<RestResearchOutput>('research-outputs');

export const createResearchOutput = (
  overwrites?: Partial<ResearchOutput>,
): Promise<RestResearchOutput> => {
  const researchOutputData: Partial<ResearchOutput> = {
    type: 'Article',
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
