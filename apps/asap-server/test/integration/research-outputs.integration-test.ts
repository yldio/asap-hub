// Submit something with an invalid identifierDOI
// Should receive an error

import { ResearchOutput } from '@asap-hub/squidex';
import { ResearchOutputResponse } from '@asap-hub/model';
import { createResearchOutput } from '../helpers/research-outputs';
import ResearchOutputs from '../../src/controllers/research-outputs';
import { getResearchOutputResponse } from '../fixtures/research-output.fixtures';

const researchOutputs = new ResearchOutputs(''); // TODO what should this arg be?

describe('Research Outputs', () => {
  test('Invalid identifierDois should fail', async () => {
    const researchOutput: Partial<ResearchOutput> = {
      type: 'Proposal',
      title: 'Research Output Title',
      description: 'Research Output Description',
      sharingStatus: 'Network Only',
      asapFunded: 'Not Sure',
      usedInAPublication: 'Not Sure',
      pmsEmails: []
    };

    researchOutput.identifierDoi = 'invalid identifierDoi';

    await createResearchOutput(researchOutput);

    const result = await researchOutputs.fetch({
      take: 1,
      skip: 0
    });
    console.log(result);

    // This should be an error
    // const expectedResponse: Partial<ResearchOutputResponse> = {

    // };

    // expect(expectedResponse).toEqual({
    //   total: 1,
    //   items: [expect.objectContaining(expectedResponse)]
    // });
  });
});