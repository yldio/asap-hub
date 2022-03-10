import { Chance } from 'chance';
import { ResearchOutput, SquidexGraphql } from '@asap-hub/squidex';
import { ResearchOutputResponse } from '@asap-hub/model';
import { createResearchOutput } from '../helpers/research-outputs';
import ResearchOutputs from '../../src/controllers/research-outputs';

const chance = new Chance();
const researchOutputs = new ResearchOutputs(new SquidexGraphql());

describe('Research Outputs', () => {
  const randomTitle = chance.guid();

  const researchOutput: Partial<ResearchOutput> = {
    type: 'Grant Document',
    title: randomTitle,
    description: 'Research Output Description',
    sharingStatus: 'Network Only',
    asapFunded: 'Not Sure',
    usedInAPublication: 'Not Sure',
    addedDate: '2021-05-21T13:18:31Z',
  };

  test('Valid dois should succeed', async () => {
    researchOutput.doi = '10.5555/YFRU1371';

    await createResearchOutput(researchOutput);

    const result = await researchOutputs.fetch({
      take: 1,
      skip: 0,
      search: randomTitle,
    });

    const expectedResponse: Partial<ResearchOutputResponse> = {
      type: 'Grant Document',
      title: randomTitle,
      description: 'Research Output Description',
      sharingStatus: 'Network Only',
      asapFunded: undefined,
      usedInPublication: undefined,
    };

    expect(result).toEqual({
      total: 1,
      items: [expect.objectContaining(expectedResponse)],
    });
  });

  test('Invalid dois should fail', async () => {
    researchOutput.doi = 'invalid doi';

    try {
      await createResearchOutput(researchOutput);
    } catch (e) {
      const parsedErrorData = JSON.parse(e.data);

      expect(parsedErrorData.message).toBe('Validation error');
      expect(parsedErrorData.statusCode).toBe(400);
      expect(parsedErrorData.details[0]).toBe(
        'doi.iv: Must follow the pattern.',
      );
    }
  });
});
