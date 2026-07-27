import {
  RESEARCH_OUTPUT_FLOW_IDS,
  researchOutputDocumentTypes,
  ResearchOutputFlowId,
} from '@asap-hub/model';
import { render } from '@testing-library/react';

import {
  getVisibleResearchOutputActions,
  resolveResearchOutputAvailableActions,
  useResearchOutputPermissionsContext,
} from '../../permissions/research-output';

const TestComponent: React.FC<{ index?: number }> = () => {
  const {
    canShareResearchOutput,
    canEditResearchOutput,
    canPublishResearchOutput,
  } = useResearchOutputPermissionsContext();
  return (
    <>
      <span>
        canShareResearchOutput: {canShareResearchOutput ? 'true' : 'false'}
      </span>
      <span>
        canEditResearchOutput: {canEditResearchOutput ? 'true' : 'false'}
      </span>
      <span>
        canPublishResearchOutput: {canPublishResearchOutput ? 'true' : 'false'}
      </span>
    </>
  );
};

it('passes through default profile context', () => {
  const { getByText } = render(<TestComponent />);
  expect(getByText('canShareResearchOutput: false')).toBeVisible();
  expect(getByText('canEditResearchOutput: false')).toBeVisible();
  expect(getByText('canPublishResearchOutput: false')).toBeVisible();
});

describe('getVisibleResearchOutputActions', () => {
  const permissions = {
    canEditResearchOutput: false,
    canDuplicateResearchOutput: false,
    showRequestReview: false,
    canVersionResearchOutput: false,
    canPublishResearchOutput: false,
  };

  const state = {
    published: false,
    isInReview: false,
    hasRelatedManuscript: false,
    isWorkingGroupOutput: false,
    isGrantDocument: false,
  };

  it('sets all actions to false if output is a grant document', () => {
    expect(
      getVisibleResearchOutputActions(
        {
          ...permissions,
          canEditResearchOutput: true,
          canPublishResearchOutput: false,
        },
        {
          ...state,
          isGrantDocument: true,
        },
      ),
    ).toEqual(
      expect.objectContaining({
        showEdit: false,
        showDuplicate: false,
        showRequestReview: false,
        showAddVersion: false,
        showImportManuscriptVersion: false,
        showSwitchToDraft: false,
        showPublish: false,
      }),
    );
  });

  describe('showEdit action', () => {
    it('sets showEdit to true if output is not in review and user has edit permission', () => {
      expect(
        getVisibleResearchOutputActions(
          {
            ...permissions,
            canEditResearchOutput: true,
            canPublishResearchOutput: false,
          },
          {
            ...state,
            isInReview: false,
          },
        ),
      ).toEqual(
        expect.objectContaining({
          showEdit: true,
        }),
      );
    });
    it('sets showEdit to true if output is in review and user has publish permission', () => {
      expect(
        getVisibleResearchOutputActions(
          {
            ...permissions,
            canEditResearchOutput: true,
            canPublishResearchOutput: true,
          },
          {
            ...state,
            isInReview: true,
          },
        ),
      ).toEqual(
        expect.objectContaining({
          showEdit: true,
        }),
      );
    });

    it('sets showEdit to false if output is in review and user does not have publish permission', () => {
      expect(
        getVisibleResearchOutputActions(
          {
            ...permissions,
            canEditResearchOutput: true,
            canPublishResearchOutput: false,
          },
          {
            ...state,
            isInReview: true,
          },
        ),
      ).toEqual(
        expect.objectContaining({
          showEdit: false,
        }),
      );
    });
  });

  describe('showDuplicate action', () => {
    it('sets showDuplicate to true if output is working group output and user has duplicate permission', () => {
      expect(
        getVisibleResearchOutputActions(
          {
            ...permissions,
            canDuplicateResearchOutput: true,
          },
          {
            ...state,
            isWorkingGroupOutput: true,
          },
        ),
      ).toEqual(
        expect.objectContaining({
          showDuplicate: true,
        }),
      );
    });

    it('sets showDuplicate to true if output is team based but not linked to a manuscript and user has duplicate permission', () => {
      expect(
        getVisibleResearchOutputActions(
          {
            ...permissions,
            canDuplicateResearchOutput: true,
          },
          {
            ...state,
            isWorkingGroupOutput: false,
            hasRelatedManuscript: false,
          },
        ),
      ).toEqual(
        expect.objectContaining({
          showDuplicate: true,
        }),
      );
    });

    it('sets showDuplicate to false if user does not have duplicate permission', () => {
      expect(
        getVisibleResearchOutputActions(
          {
            ...permissions,
            canDuplicateResearchOutput: false,
          },
          {
            ...state,
            isWorkingGroupOutput: false,
            hasRelatedManuscript: false,
          },
        ),
      ).toEqual(
        expect.objectContaining({
          showDuplicate: false,
        }),
      );
    });
  });

  describe('showRequestReview action', () => {
    it('sets showRequestReview to false if user does not have permission', () => {
      expect(
        getVisibleResearchOutputActions(
          {
            ...permissions,
            canRequestReview: false,
          },
          {
            ...state,
            published: false,
            isInReview: false,
          },
        ),
      ).toEqual(
        expect.objectContaining({
          showRequestReview: false,
        }),
      );
    });

    it('sets showRequestReview to false if output is published', () => {
      expect(
        getVisibleResearchOutputActions(
          {
            ...permissions,
            canRequestReview: true,
          },
          {
            ...state,
            published: true,
            isInReview: false,
          },
        ),
      ).toEqual(
        expect.objectContaining({
          showRequestReview: false,
        }),
      );
    });

    it('sets showRequestReview to false if output is already in review', () => {
      expect(
        getVisibleResearchOutputActions(
          {
            ...permissions,
            canRequestReview: true,
          },
          {
            ...state,
            published: false,
            isInReview: true,
          },
        ),
      ).toEqual(
        expect.objectContaining({
          showRequestReview: false,
        }),
      );
    });

    it('sets showRequestReview to true if all conditions are met', () => {
      expect(
        getVisibleResearchOutputActions(
          {
            ...permissions,
            canRequestReview: true,
          },
          {
            ...state,
            isInReview: false,
            published: false,
          },
        ),
      ).toEqual(
        expect.objectContaining({
          showRequestReview: true,
        }),
      );
    });
  });

  describe('showAddVersion action', () => {
    it('sets showAddVersion to false if user does not have canVersion permission', () => {
      expect(
        getVisibleResearchOutputActions(
          {
            ...permissions,
            canVersionResearchOutput: false,
          },
          {
            ...state,
            published: true,
            hasRelatedManuscript: false,
          },
        ),
      ).toEqual(
        expect.objectContaining({
          showAddVersion: false,
        }),
      );
    });

    it('sets showAddVersion to false if output is not published', () => {
      expect(
        getVisibleResearchOutputActions(
          {
            ...permissions,
            canVersionResearchOutput: true,
          },
          {
            ...state,
            published: false,
            hasRelatedManuscript: false,
          },
        ),
      ).toEqual(
        expect.objectContaining({
          showAddVersion: false,
        }),
      );
    });

    it('sets showAddVersion to false if output is linked to a manuscript', () => {
      expect(
        getVisibleResearchOutputActions(
          {
            ...permissions,
            canVersionResearchOutput: true,
          },
          {
            ...state,
            published: true,
            hasRelatedManuscript: true,
          },
        ),
      ).toEqual(
        expect.objectContaining({
          showAddVersion: false,
        }),
      );
    });

    it('sets showAddVersion to true if all conditions are met', () => {
      expect(
        getVisibleResearchOutputActions(
          {
            ...permissions,
            canVersionResearchOutput: true,
          },
          {
            ...state,
            published: true,
            hasRelatedManuscript: false,
          },
        ),
      ).toEqual(
        expect.objectContaining({
          showAddVersion: true,
        }),
      );
    });
  });

  describe('showImportManuscriptVersion action', () => {
    it('sets showImportManuscriptVersion to false if user does not have canVersion permission', () => {
      expect(
        getVisibleResearchOutputActions(
          {
            ...permissions,
            canVersionResearchOutput: false,
          },
          {
            ...state,
            published: true,
            hasRelatedManuscript: true,
          },
        ),
      ).toEqual(
        expect.objectContaining({
          showImportManuscriptVersion: false,
        }),
      );
    });

    it('sets showImportManuscriptVersion to false if output is not published', () => {
      expect(
        getVisibleResearchOutputActions(
          {
            ...permissions,
            canVersionResearchOutput: true,
          },
          {
            ...state,
            published: false,
            hasRelatedManuscript: true,
          },
        ),
      ).toEqual(
        expect.objectContaining({
          showImportManuscriptVersion: false,
        }),
      );
    });

    it('sets showImportManuscriptVersion to false if output is not linked to a manuscript', () => {
      expect(
        getVisibleResearchOutputActions(
          {
            ...permissions,
            canVersionResearchOutput: true,
          },
          {
            ...state,
            published: true,
            hasRelatedManuscript: false,
          },
        ),
      ).toEqual(
        expect.objectContaining({
          showImportManuscriptVersion: false,
        }),
      );
    });

    it('sets showImportManuscriptVersion to true if all conditions are met', () => {
      expect(
        getVisibleResearchOutputActions(
          {
            ...permissions,
            canVersionResearchOutput: true,
          },
          {
            ...state,
            published: true,
            hasRelatedManuscript: true,
          },
        ),
      ).toEqual(
        expect.objectContaining({
          showImportManuscriptVersion: true,
        }),
      );
    });
  });

  describe('showSwitchToDraft action', () => {
    it('sets showSwitchToDraft to false if user does not have publish permission', () => {
      expect(
        getVisibleResearchOutputActions(
          {
            ...permissions,
            canPublishResearchOutput: false,
          },
          {
            ...state,
            published: false,
            isInReview: true,
          },
        ),
      ).toEqual(
        expect.objectContaining({
          showSwitchToDraft: false,
        }),
      );
    });

    it('sets showSwitchToDraft to false if output is published', () => {
      expect(
        getVisibleResearchOutputActions(
          {
            ...permissions,
            canPublishResearchOutput: true,
          },
          {
            ...state,
            published: true,
            isInReview: true,
          },
        ),
      ).toEqual(
        expect.objectContaining({
          showSwitchToDraft: false,
        }),
      );
    });

    it('sets showSwitchToDraft to false if output is not in review', () => {
      expect(
        getVisibleResearchOutputActions(
          {
            ...permissions,
            canPublishResearchOutput: true,
          },
          {
            ...state,
            published: false,
            isInReview: false,
          },
        ),
      ).toEqual(
        expect.objectContaining({
          showSwitchToDraft: false,
        }),
      );
    });

    it('sets showSwitchToDraft to true when all conditions are met', () => {
      expect(
        getVisibleResearchOutputActions(
          {
            ...permissions,
            canPublishResearchOutput: true,
          },
          {
            ...state,
            published: false,
            isInReview: true,
          },
        ),
      ).toEqual(
        expect.objectContaining({
          showSwitchToDraft: true,
        }),
      );
    });
  });

  describe('showPublish action', () => {
    it('sets showPublish to false if user does not have publish permission', () => {
      expect(
        getVisibleResearchOutputActions(
          {
            ...permissions,
            canPublishResearchOutput: false,
          },
          {
            ...state,
            published: false,
          },
        ),
      ).toEqual(
        expect.objectContaining({
          showPublish: false,
        }),
      );
    });

    it('sets showPublish to false if output is already published', () => {
      expect(
        getVisibleResearchOutputActions(
          {
            ...permissions,
            canPublishResearchOutput: true,
          },
          {
            ...state,
            published: true,
          },
        ),
      ).toEqual(
        expect.objectContaining({
          showPublish: false,
        }),
      );
    });

    it('sets showPublish to true if output is not published and user has publish permission', () => {
      expect(
        getVisibleResearchOutputActions(
          {
            ...permissions,
            canPublishResearchOutput: true,
          },
          {
            ...state,
            published: false,
          },
        ),
      ).toEqual(
        expect.objectContaining({
          showPublish: true,
        }),
      );
    });
  });
});

describe('resolveResearchOutputAvailableActions', () => {
  it('resolves disableImpactAndCategory action correctly', () => {
    expect(
      resolveResearchOutputAvailableActions({
        flowId: 'team-create-manual',
        permissions: { canShareResearchOutput: true },
        documentType: 'Bioinformatics',
      }),
    ).toEqual(
      expect.objectContaining({
        disableImpactAndCategory: false,
      }),
    );

    expect(
      resolveResearchOutputAvailableActions({
        flowId: 'team-add-version',
        permissions: { canShareResearchOutput: true },
        documentType: 'Bioinformatics',
      }),
    ).toEqual(
      expect.objectContaining({
        disableImpactAndCategory: true,
      }),
    );
  });

  describe('disableDateMadePublic truth table', () => {
    // pseudo code: disabled = hasPublishDate && (isImportedFromManuscript || hasId)
    // note 1: the flows team-create-manual and working-group-create shouldn't
    // have already a publish date pre-filled in real life, but they are still in
    // this truth table so all cases are covered
    // note 2: the flows team-duplicate and working-group-duplicate also shouldn't
    // have ids pre-filled in real life

    const withDate = '2021-01-01T00:00:00Z';

    test.each`
      flowId                                    | publishDate  | id        | expectedDisabled
      ${'team-create-imported-from-manuscript'} | ${withDate}  | ${''}     | ${true}
      ${'team-create-imported-from-manuscript'} | ${withDate}  | ${'ro-1'} | ${true}
      ${'team-add-version-from-manuscript'}     | ${withDate}  | ${''}     | ${true}
      ${'team-add-version-from-manuscript'}     | ${withDate}  | ${'ro-1'} | ${true}
      ${'team-create-manual'}                   | ${withDate}  | ${'ro-1'} | ${true}
      ${'team-edit-draft'}                      | ${withDate}  | ${'ro-1'} | ${true}
      ${'team-edit-published'}                  | ${withDate}  | ${'ro-1'} | ${true}
      ${'team-add-version'}                     | ${withDate}  | ${'ro-1'} | ${true}
      ${'team-duplicate'}                       | ${withDate}  | ${'ro-1'} | ${true}
      ${'working-group-create'}                 | ${withDate}  | ${'ro-1'} | ${true}
      ${'working-group-edit-draft'}             | ${withDate}  | ${'ro-1'} | ${true}
      ${'working-group-edit-published'}         | ${withDate}  | ${'ro-1'} | ${true}
      ${'working-group-add-version'}            | ${withDate}  | ${'ro-1'} | ${true}
      ${'working-group-duplicate'}              | ${withDate}  | ${'ro-1'} | ${true}
      ${'team-create-manual'}                   | ${undefined} | ${''}     | ${false}
      ${'team-create-manual'}                   | ${undefined} | ${'ro-1'} | ${false}
      ${'team-create-manual'}                   | ${withDate}  | ${''}     | ${false}
      ${'team-create-imported-from-manuscript'} | ${undefined} | ${''}     | ${false}
      ${'team-create-imported-from-manuscript'} | ${undefined} | ${'ro-1'} | ${false}
      ${'team-edit-draft'}                      | ${undefined} | ${''}     | ${false}
      ${'team-edit-draft'}                      | ${undefined} | ${'ro-1'} | ${false}
      ${'team-edit-draft'}                      | ${withDate}  | ${''}     | ${false}
      ${'team-edit-published'}                  | ${undefined} | ${''}     | ${false}
      ${'team-edit-published'}                  | ${undefined} | ${'ro-1'} | ${false}
      ${'team-edit-published'}                  | ${withDate}  | ${''}     | ${false}
      ${'team-add-version'}                     | ${undefined} | ${''}     | ${false}
      ${'team-add-version'}                     | ${undefined} | ${'ro-1'} | ${false}
      ${'team-add-version'}                     | ${withDate}  | ${''}     | ${false}
      ${'team-add-version-from-manuscript'}     | ${undefined} | ${''}     | ${false}
      ${'team-add-version-from-manuscript'}     | ${undefined} | ${'ro-1'} | ${false}
      ${'team-duplicate'}                       | ${undefined} | ${''}     | ${false}
      ${'team-duplicate'}                       | ${undefined} | ${'ro-1'} | ${false}
      ${'team-duplicate'}                       | ${withDate}  | ${''}     | ${false}
      ${'working-group-create'}                 | ${undefined} | ${''}     | ${false}
      ${'working-group-create'}                 | ${undefined} | ${'ro-1'} | ${false}
      ${'working-group-create'}                 | ${withDate}  | ${''}     | ${false}
      ${'working-group-edit-draft'}             | ${undefined} | ${''}     | ${false}
      ${'working-group-edit-draft'}             | ${undefined} | ${'ro-1'} | ${false}
      ${'working-group-edit-draft'}             | ${withDate}  | ${''}     | ${false}
      ${'working-group-edit-published'}         | ${undefined} | ${''}     | ${false}
      ${'working-group-edit-published'}         | ${undefined} | ${'ro-1'} | ${false}
      ${'working-group-edit-published'}         | ${withDate}  | ${''}     | ${false}
      ${'working-group-add-version'}            | ${undefined} | ${''}     | ${false}
      ${'working-group-add-version'}            | ${undefined} | ${'ro-1'} | ${false}
      ${'working-group-add-version'}            | ${withDate}  | ${''}     | ${false}
      ${'working-group-duplicate'}              | ${undefined} | ${''}     | ${false}
      ${'working-group-duplicate'}              | ${undefined} | ${'ro-1'} | ${false}
      ${'working-group-duplicate'}              | ${withDate}  | ${''}     | ${false}
    `(
      'disableDateMadePublic is $expectedDisabled for $flowId (publishDate: $publishDate, id: $id)',
      ({ flowId, publishDate, id, expectedDisabled }) => {
        expect(
          resolveResearchOutputAvailableActions({
            flowId,
            permissions: { canShareResearchOutput: true },
            documentType: 'Bioinformatics',
            researchOutputData: { versions: [], publishDate, id },
          }),
        ).toEqual(
          expect.objectContaining({
            disableDateMadePublic: expectedDisabled,
          }),
        );
      },
    );

    it('is false when researchOutputData is not provided', () => {
      expect(
        resolveResearchOutputAvailableActions({
          flowId: 'team-create-imported-from-manuscript',
          permissions: { canShareResearchOutput: true },
          documentType: 'Bioinformatics',
        }),
      ).toEqual(
        expect.objectContaining({
          disableDateMadePublic: false,
        }),
      );
    });
  });

  it('resolves saveDraft action correctly', () => {
    expect(
      resolveResearchOutputAvailableActions({
        flowId: 'team-create-manual',
        permissions: { canShareResearchOutput: true },
        documentType: 'Bioinformatics',
      }),
    ).toEqual(
      expect.objectContaining({
        canSaveDraft: true,
      }),
    );
  });

  describe('showImpactAndCategory', () => {
    it('is true when documentType is Article', () => {
      expect(
        resolveResearchOutputAvailableActions({
          flowId: 'team-create-manual',
          permissions: { canShareResearchOutput: true },
          documentType: 'Article',
        }),
      ).toEqual(
        expect.objectContaining({
          showImpactAndCategory: true,
        }),
      );
    });

    const notArticleDocumentTypes = researchOutputDocumentTypes.filter(
      (type) => type !== 'Article',
    );

    it.each(notArticleDocumentTypes)(
      'is false when document type is %s',
      (documentType) => {
        expect(
          resolveResearchOutputAvailableActions({
            flowId: 'team-create-manual',
            permissions: { canShareResearchOutput: true },
            documentType,
          }),
        ).toEqual(
          expect.objectContaining({
            showImpactAndCategory: false,
          }),
        );
      },
    );
  });

  describe('showChangelogAndVersionHistory', () => {
    const version = {
      id: 'v1',
      title: 'Previous',
      documentType: 'Article' as const,
    };

    // Changelog and version history are visible only on edit/add-version flows
    // AND when the output already has versions. This truth table locks the
    // expected outcome for every RESEARCH_OUTPUT_FLOW_IDS when versions exist.
    const whenVersionedExpectations = {
      'team-create-manual': false,
      'team-create-imported-from-manuscript': false,
      'team-edit-draft': true,
      'team-edit-published': true,
      'team-add-version': true,
      'team-add-version-from-manuscript': true,
      'team-duplicate': false,
      'working-group-create': false,
      'working-group-edit-draft': true,
      'working-group-edit-published': true,
      'working-group-add-version': true,
      'working-group-duplicate': false,
    } as const satisfies Record<ResearchOutputFlowId, boolean>;

    const resolve = (flowId: ResearchOutputFlowId, hasVersions: boolean) =>
      resolveResearchOutputAvailableActions({
        flowId,
        permissions: { canShareResearchOutput: true },
        documentType: 'Article',
        versions: hasVersions ? [version] : [],
      }).showChangelogAndVersionHistory;

    it.each(Object.entries(whenVersionedExpectations))(
      'flow %s with versions resolves to %s',
      (flowId, expected) => {
        expect(resolve(flowId as ResearchOutputFlowId, true)).toBe(expected);
      },
    );

    it.each(Object.values(RESEARCH_OUTPUT_FLOW_IDS))(
      'is false when flow is %s and there are no versions',
      (flowId) => {
        expect(resolve(flowId, false)).toBe(false);
      },
    );
  });
});
