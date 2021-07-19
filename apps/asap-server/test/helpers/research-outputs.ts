import { Squidex, ResearchOutput, RestResearchOutput } from "@asap-hub/squidex";

const researchOutputs = new Squidex<RestResearchOutput>('researchOutputs'); // TODO check this arg

export const createResearchOutput = (overwrites?: Partial<ResearchOutput>): Promise<RestResearchOutput> => {
  const researchOutputData: Partial<ResearchOutput> = {
  };

  const researchOutput = Object.entries(researchOutputData).reduce((acc, [key, value]) => {
    acc[key] = { iv: value };
    return acc;
  }, {} as { [key: string]: { iv: unknown } }); // TODO do we need this reduce?

  return researchOutputs.create(researchOutput as RestResearchOutput['data']);
};