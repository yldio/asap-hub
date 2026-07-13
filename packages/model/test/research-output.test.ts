import {
  convertBooleanToDecision,
  convertDecisionToBoolean,
  FLOW_DEFINITIONS,
  getProjectResearchOutputDisplaySource,
  getResearchOutputFlowBehavior,
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

    it('treats outputs with working groups but no project as team-based', () => {
      expect(
        getProjectResearchOutputDisplaySource({
          project: undefined,
          workingGroups: [{ id: 'wg1', title: 'Working Group' }],
        }),
      ).toBe('team');
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

    it('should return null when type is undefined or null', () => {
      expect(researchOutputMapType(undefined)).toBeNull();
      expect(researchOutputMapType(null)).toBeNull();
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

describe('getResearchOutputFlowBehavior', () => {
  test.each`
    flowId                                    | supportsDrafts | requiresAddVersionConfirm | requiresPublishConfirm | requiresSameDescriptionConfirm
    ${'team-create-manual'}                   | ${true}        | ${false}                  | ${true}                | ${false}
    ${'team-create-imported-from-manuscript'} | ${false}       | ${false}                  | ${true}                | ${false}
    ${'team-edit-draft'}                      | ${true}        | ${false}                  | ${true}                | ${false}
    ${'team-edit-published'}                  | ${false}       | ${false}                  | ${false}               | ${false}
    ${'team-add-version'}                     | ${false}       | ${true}                   | ${false}               | ${false}
    ${'team-add-version-from-manuscript'}     | ${false}       | ${true}                   | ${false}               | ${false}
    ${'team-duplicate'}                       | ${true}        | ${false}                  | ${true}                | ${true}
    ${'working-group-create'}                 | ${true}        | ${false}                  | ${true}                | ${false}
    ${'working-group-edit-draft'}             | ${true}        | ${false}                  | ${true}                | ${false}
    ${'working-group-edit-published'}         | ${false}       | ${false}                  | ${false}               | ${false}
    ${'working-group-add-version'}            | ${false}       | ${true}                   | ${false}               | ${false}
    ${'working-group-duplicate'}              | ${true}        | ${false}                  | ${true}                | ${true}
  `(
    '$flowId supports drafts: $supportsDrafts, requires add version confirm: $requiresAddVersionConfirm, requires publish confirm: $requiresPublishConfirm, requires same description confirm: $requiresSameDescriptionConfirm',
    ({
      flowId,
      supportsDrafts,
      requiresAddVersionConfirm,
      requiresPublishConfirm,
      requiresSameDescriptionConfirm,
    }) => {
      expect(getResearchOutputFlowBehavior(flowId)).toEqual({
        supportsDrafts,
        requiresAddVersionConfirm,
        requiresPublishConfirm,
        requiresSameDescriptionConfirm,
      });
    },
  );

  it('never requires add version confirm on a flow that supports drafts', () => {
    Object.keys(FLOW_DEFINITIONS).forEach((flowId) => {
      const behavior = getResearchOutputFlowBehavior(
        flowId as keyof typeof FLOW_DEFINITIONS,
      );
      expect(
        behavior.supportsDrafts && behavior.requiresAddVersionConfirm,
      ).toBe(false);
    });
  });

  it('never requires both add version and publish confirm on the same flow', () => {
    Object.keys(FLOW_DEFINITIONS).forEach((flowId) => {
      const behavior = getResearchOutputFlowBehavior(
        flowId as keyof typeof FLOW_DEFINITIONS,
      );
      expect(
        behavior.requiresAddVersionConfirm && behavior.requiresPublishConfirm,
      ).toBe(false);
    });
  });

  it('only requires same description confirm on duplicate flows', () => {
    Object.entries(FLOW_DEFINITIONS).forEach(([flowId, flow]) => {
      const behavior = getResearchOutputFlowBehavior(
        flowId as keyof typeof FLOW_DEFINITIONS,
      );
      expect(behavior.requiresSameDescriptionConfirm).toBe(
        flow.action === 'duplicate',
      );
    });
  });

  it('covers every registered flow', () => {
    expect(Object.keys(FLOW_DEFINITIONS)).toHaveLength(12);
  });
});
