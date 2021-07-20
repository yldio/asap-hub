import { Chance } from 'chance';
import { ResearchOutput } from '@asap-hub/squidex';
import { ResearchOutputResponse } from '@asap-hub/model';
import { createResearchOutput } from '../helpers/research-outputs';
import ResearchOutputs from '../../src/controllers/research-outputs';

const chance = new Chance();
const researchOutputs = new ResearchOutputs();

describe('Research Outputs', () => {
  const randomTitle = chance.guid();

  const researchOutput: Partial<ResearchOutput> = {
    type: 'Proposal',
    title: randomTitle,
    description: 'Research Output Description',
    sharingStatus: 'Network Only',
    asapFunded: 'Not Sure',
    usedInAPublication: 'Not Sure',
  };

  test('Valid dois should succeed', async () => {
    researchOutput.doi = '10.5555/YFRU1371';

    await createResearchOutput(researchOutput);

    const result = await researchOutputs.fetch({
      take: 1,
      skip: 0,
      search: randomTitle
    });

    const expectedResponse: Partial<ResearchOutputResponse> = {
      type: 'Proposal',
      title: randomTitle,
      description: 'Research Output Description',
      sharingStatus: 'Network Only',
      asapFunded: undefined,
      usedInPublication: undefined
    };

    expect(result).toEqual({
      total: 1,
      items: [expect.objectContaining(expectedResponse)]
    });
  });

  test('Invalid dois should fail', async () => {
    researchOutput.doi = 'invalid doi';

    try {
      await createResearchOutput(researchOutput); 
    } catch (e) {
      expect(e.name).toBe('HTTPError');
      expect(e.output.statusCode).toBe(400);
      expect(e.data).toMatch("doi.iv: Must follow the pattern");
    }
  });
});
