import { ResearchOutputResponse } from '@asap-hub/model/src/research-output';
import { createResearchOutputResponse } from '@asap-hub/fixtures';
import { ResearchOutputPostRequest } from '@asap-hub/model';
import {
  isResearchOutputWorkingGroup,
  isResearchOutputWorkingGroupRequest,
} from '../research-output-guards';

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
      published: true,
      teams: ['90210'],
      documentType: 'Bioinformatics',
      link: 'http://a-link',
      title: 'A title',
      asapFunded: false,
      usedInPublication: false,
      sharingStatus: 'Public',
      publishDate: undefined,
      description: '',
      descriptionMD: '',
      type: 'Software',
      labs: ['lab1'],
      methods: [],
      organisms: [],
      environments: [],
      workingGroups,
      keywords: [],
      relatedResearch: [],
      relatedEvents: [],
    };
    expect(isResearchOutputWorkingGroupRequest(researchOutput)).toEqual(
      expected,
    );
  });
});
