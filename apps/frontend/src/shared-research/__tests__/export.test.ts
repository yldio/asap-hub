import { createResearchOutputResponse } from '@asap-hub/fixtures';
import { ResearchOutputResponse } from '@asap-hub/model';
import { researchOutputToCSV } from '../export';

it('handles flat data', () => {
  const output: ResearchOutputResponse = {
    ...createResearchOutputResponse(),
  };
  expect(researchOutputToCSV(output)).toEqual({});
});
