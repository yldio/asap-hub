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
  it('resolves showSaveDraftButton action correctly', () => {
    expect(
      resolveResearchOutputAvailableActions({
        flowId: 'team-create-manual',
        permissions: { canShareResearchOutput: true },
        researchOutputData: undefined,
        documentType: 'Article',
        versions: [],
        isImportedFromManuscript: false,
      }),
    ).toEqual(
      expect.objectContaining({
        showSaveDraftButton: true,
      }),
    );
  });
});
