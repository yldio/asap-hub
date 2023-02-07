import { ResearchOutputResponse } from '@asap-hub/model/src/research-output';
import { createResearchOutputResponse } from '@asap-hub/fixtures';
import { isTeamResearchOutput } from '../src/research-output-guards';

describe('isTeamResearchOutput', () => {
  test.each`
    description                                        | given                                 | expected
    ${'returns true when workingGroups is empty'}      | ${[]}                                 | ${true}
    ${'returns false when workingGroups is not empty'} | ${[{ id: 'wg1', title: 'wg title' }]} | ${false}
  `('$description', ({ given, expected }) => {
    const researchOutput: ResearchOutputResponse = {
      ...createResearchOutputResponse(),
      workingGroups: given,
    };
    expect(isTeamResearchOutput(researchOutput)).toEqual(expected);
  });
});
