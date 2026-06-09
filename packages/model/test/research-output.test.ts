import {
  convertBooleanToDecision,
  convertDecisionToBoolean,
  getProjectResearchOutputDisplaySource,
  isResearchOutputDocumentType,
  isResearchOutputType,
  researchOutputMapType,
} from '../src/research-output';

describe('Research Output Model', () => {
  describe('Document Types', () => {
    it('should recognise correct type', () => {
      expect(isResearchOutputDocumentType('Dataset')).toEqual(true);
    });

    it('should not recognise incorrect type', () => {
      expect(isResearchOutputDocumentType('NotADataset')).toEqual(false);
    });
  });

  describe('project research output association', () => {
    it('treats outputs without project or working group as team-based', () => {
      expect(
        getProjectResearchOutputDisplaySource({
          project: undefined,
          workingGroups: undefined,
        }),
      ).toBe('team');
    });

    it('maps user-based outputs to project display source', () => {
      expect(
        getProjectResearchOutputDisplaySource({
          project: {
            id: 'p1',
            title: 'Project',
            projectType: 'Resource Project',
          },
        }),
      ).toBe('project');
    });
  });

  describe('Types', () => {
    it('should recognise correct type', () => {
      expect(isResearchOutputType('Report')).toEqual(true);
    });

    it('should not recognise incorrect type', () => {
      expect(isResearchOutputType('NotAReport')).toEqual(false);
    });

    it('should map type', () => {
      expect(researchOutputMapType('Analysis')).toEqual('Analysis');
    });

    it('should return null on not known type', () => {
      expect(researchOutputMapType('NotACloningType')).toBeNull();
    });
  });
});

describe('convertBooleanToDecision', () => {
  test.each`
    description                          | given        | expected
    ${'returns Yes when true'}           | ${true}      | ${'Yes'}
    ${'returns No when false'}           | ${false}     | ${'No'}
    ${'returns Not Sure when undefined'} | ${undefined} | ${'Not Sure'}
  `('$description', ({ given, expected }) => {
    expect(convertBooleanToDecision(given)).toEqual(expected);
  });
});

describe('convertDecisionToBoolean', () => {
  test.each`
    description                          | given         | expected
    ${'returns true when Yes'}           | ${'Yes'}      | ${true}
    ${'returns false when No'}           | ${'No'}       | ${false}
    ${'returns undefined when Not Sure'} | ${'Not Sure'} | ${undefined}
  `('$description', ({ given, expected }) => {
    expect(convertDecisionToBoolean(given)).toEqual(expected);
  });
});
