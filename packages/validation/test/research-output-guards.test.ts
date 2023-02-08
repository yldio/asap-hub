import { ResearchOutputResponse } from '@asap-hub/model/src/research-output';
import { createResearchOutputResponse } from '@asap-hub/fixtures';
import { isResearchOutputWorkingGroup } from '../src/research-output-guards';

describe('isResearchOutputWorkingGroup', () => {
  test.each`
    description                                       | workingGroups                         | expected
    ${'returns false when workingGroups is empty'}    | ${[]}                                 | ${false}
    ${'returns true when workingGroups is not empty'} | ${[{ id: 'wg1', title: 'wg title' }]} | ${true}
  `('$description', ({ workingGroups, expected }) => {
    const researchOutput: ResearchOutputResponse = {
      ...createResearchOutputResponse(),
      workingGroups,
    };
    expect(isResearchOutputWorkingGroup(researchOutput)).toEqual(expected);
  });
});
