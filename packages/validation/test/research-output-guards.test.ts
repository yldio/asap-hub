import { ResearchOutputResponse } from '@asap-hub/model/src/research-output';
import { createResearchOutputResponse } from '@asap-hub/fixtures';
import {
  isResearchOutputWorkingGroup,
  isResearchOutputWorkingGroupRequest,
} from '../src/research-output-guards';
import { ResearchOutputPostRequest } from '@asap-hub/model';

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

describe('isResearchOutputWorkingGroupRequest', () => {
  test.each`
    description                                       | workingGroups        | expected
    ${'returns false when workingGroups is empty'}    | ${[]}                | ${false}
    ${'returns true when workingGroups is not empty'} | ${['working-group']} | ${true}
  `('$description', ({ workingGroups, expected }) => {
    const researchOutput: ResearchOutputPostRequest = {
      teams: ['90210'],
      documentType: 'Bioinformatics',
      link: 'http://a-link',
      title: 'A title',
      asapFunded: false,
      usedInPublication: false,
      sharingStatus: 'Public',
      publishDate: undefined,
      description: '',
      tags: [],
      type: 'Software',
      labs: ['lab1'],
      methods: [],
      organisms: [],
      environments: [],
      workingGroups,
    };
    expect(isResearchOutputWorkingGroupRequest(researchOutput)).toEqual(
      expected,
    );
  });
});
