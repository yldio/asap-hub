import { ResearchOutputResponse } from '@asap-hub/model/src/research-output';
import { createResearchOutputResponse } from '@asap-hub/fixtures';
import { ResearchOutputPostRequest } from '@asap-hub/model';
import {
  getResearchOutputEntityType,
  isResearchOutputProject,
  isResearchOutputWorkingGroup,
  isResearchOutputWorkingGroupRequest,
} from '../research-output-guards';

describe('getResearchOutputEntityType', () => {
  test.each`
    description             | publishingEntity   | expected
    ${'maps Working Group'} | ${'Working Group'} | ${'working-group'}
    ${'maps Project'}       | ${'Project'}       | ${'project'}
    ${'maps Team'}          | ${'Team'}          | ${'team'}
  `('$description', ({ publishingEntity, expected }) => {
    const researchOutput: ResearchOutputResponse = {
      ...createResearchOutputResponse(),
      publishingEntity,
    };
    expect(getResearchOutputEntityType(researchOutput)).toEqual(expected);
  });
});

describe('isResearchOutputWorkingGroup', () => {
  test.each`
    description                         | publishingEntity   | expected
    ${'returns true for Working Group'} | ${'Working Group'} | ${true}
    ${'returns false for Team'}         | ${'Team'}          | ${false}
    ${'returns false for Project'}      | ${'Project'}       | ${false}
  `('$description', ({ publishingEntity, expected }) => {
    const researchOutput: ResearchOutputResponse = {
      ...createResearchOutputResponse(),
      publishingEntity,
      workingGroups:
        publishingEntity === 'Working Group'
          ? [{ id: 'wg1', title: 'wg title' }]
          : undefined,
    };
    expect(isResearchOutputWorkingGroup(researchOutput)).toEqual(expected);
  });
});

describe('isResearchOutputProject', () => {
  test.each`
    description                          | publishingEntity   | expected
    ${'returns true for Project'}        | ${'Project'}       | ${true}
    ${'returns false for Team'}          | ${'Team'}          | ${false}
    ${'returns false for Working Group'} | ${'Working Group'} | ${false}
  `('$description', ({ publishingEntity, expected }) => {
    const researchOutput: ResearchOutputResponse = {
      ...createResearchOutputResponse(),
      publishingEntity,
      project:
        publishingEntity === 'Project'
          ? {
              id: 'p1',
              title: 'Project',
              projectType: 'Trainee Project',
              projectId: 'TP1',
            }
          : undefined,
    };
    expect(isResearchOutputProject(researchOutput)).toEqual(expected);
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
      shortDescription: '',
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
