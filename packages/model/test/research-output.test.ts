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
    flowId                                    | isAddVersionFlow | isEditFlow | supportsDrafts | requiresAddVersionConfirm | requiresPublishConfirm | requiresSameDescriptionConfirm | publishesOnSave
    ${'team-create-manual'}                   | ${false}         | ${false}   | ${true}        | ${false}                  | ${true}                | ${false}                       | ${true}
    ${'team-create-imported-from-manuscript'} | ${false}         | ${false}   | ${false}       | ${false}                  | ${true}                | ${false}                       | ${true}
    ${'team-edit-draft'}                      | ${false}         | ${true}    | ${true}        | ${false}                  | ${true}                | ${false}                       | ${true}
    ${'team-edit-published'}                  | ${false}         | ${true}    | ${false}       | ${false}                  | ${false}               | ${false}                       | ${false}
    ${'team-add-version'}                     | ${true}          | ${false}   | ${false}       | ${true}                   | ${false}               | ${false}                       | ${true}
    ${'team-add-version-from-manuscript'}     | ${true}          | ${false}   | ${false}       | ${true}                   | ${false}               | ${false}                       | ${true}
    ${'team-duplicate'}                       | ${false}         | ${false}   | ${true}        | ${false}                  | ${true}                | ${true}                        | ${true}
    ${'working-group-create'}                 | ${false}         | ${false}   | ${true}        | ${false}                  | ${true}                | ${false}                       | ${true}
    ${'working-group-edit-draft'}             | ${false}         | ${true}    | ${true}        | ${false}                  | ${true}                | ${false}                       | ${true}
    ${'working-group-edit-published'}         | ${false}         | ${true}    | ${false}       | ${false}                  | ${false}               | ${false}                       | ${false}
    ${'working-group-add-version'}            | ${true}          | ${false}   | ${false}       | ${true}                   | ${false}               | ${false}                       | ${true}
    ${'working-group-duplicate'}              | ${false}         | ${false}   | ${true}        | ${false}                  | ${true}                | ${true}                        | ${true}
  `(
    '$flowId is add version flow: $isAddVersionFlow, is edit flow: $isEditFlow, supports drafts: $supportsDrafts, requires add version confirm: $requiresAddVersionConfirm, requires publish confirm: $requiresPublishConfirm, requires same description confirm: $requiresSameDescriptionConfirm, publishes on save: $publishesOnSave',
    ({
      flowId,
      isAddVersionFlow,
      isEditFlow,
      supportsDrafts,
      requiresAddVersionConfirm,
      requiresPublishConfirm,
      requiresSameDescriptionConfirm,
      publishesOnSave,
    }) => {
      expect(getResearchOutputFlowBehavior(flowId)).toEqual({
        isAddVersionFlow,
        isEditFlow,
        supportsDrafts,
        requiresAddVersionConfirm,
        requiresPublishConfirm,
        requiresSameDescriptionConfirm,
        publishesOnSave,
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

  it('publishes on save exactly when a confirmation was required', () => {
    Object.keys(FLOW_DEFINITIONS).forEach((flowId) => {
      const behavior = getResearchOutputFlowBehavior(
        flowId as keyof typeof FLOW_DEFINITIONS,
      );
      expect(behavior.publishesOnSave).toBe(
        behavior.requiresAddVersionConfirm || behavior.requiresPublishConfirm,
      );
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
