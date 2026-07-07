import { render } from '@testing-library/react';

import {
  getVisibleResearchOutputActions,
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
    canRequestReview: false,
    canVersionResearchOutput: false,
    canPublishResearchOutput: false,
  };

  const state = {
    published: false,
    isInReview: false,
    hasRelatedManuscript: false,
    isWorkingGroupOutput: false,
  };

  describe('canEdit action', () => {
    it('sets canEdit to true if output is not in review and user has edit permission', () => {
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
          canEdit: true,
        }),
      );
    });
    it('sets canEdit to true if output is in review and user has publish permission', () => {
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
          canEdit: true,
        }),
      );
    });

    it('sets canEdit to false if output is in review and user does not have publish permission', () => {
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
          canEdit: false,
        }),
      );
    });
  });

  describe('canDuplicate action', () => {
    it('sets canDuplicate to true if output is working group output and user has duplicate permission', () => {
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
          canDuplicate: true,
        }),
      );
    });

    it('sets canDuplicate to true if output is team based but not linked to a manuscript and user has duplicate permission', () => {
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
          canDuplicate: true,
        }),
      );
    });

    it('sets canDuplicate to false if user does not have duplicate permission', () => {
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
          canDuplicate: false,
        }),
      );
    });
  });

  describe('canRequestReview action', () => {
    it('sets canRequestReview to false if user does not have permission', () => {
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
          canRequestReview: false,
        }),
      );
    });

    it('sets canRequestReview to false if output is published', () => {
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
          canRequestReview: false,
        }),
      );
    });

    it('sets canRequestReview to false if output is already in review', () => {
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
          canRequestReview: false,
        }),
      );
    });

    it('sets canRequestReview to true if all conditions are met', () => {
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
          canRequestReview: true,
        }),
      );
    });
  });

  describe('canAddVersion action', () => {
    it('sets canAddVersion to false if user does not have canVersion permission', () => {
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
          canAddVersion: false,
        }),
      );
    });

    it('sets canAddVersion to false if output is not published', () => {
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
          canAddVersion: false,
        }),
      );
    });

    it('sets canAddVersion to false if output is linked to a manuscript', () => {
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
          canAddVersion: false,
        }),
      );
    });

    it('sets canAddVersion to true if all conditions are met', () => {
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
          canAddVersion: true,
        }),
      );
    });
  });

  describe('canImportManuscriptVersion action', () => {
    it('sets canImportManuscriptVersion to false if user does not have canVersion permission', () => {
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
          canImportManuscriptVersion: false,
        }),
      );
    });

    it('sets canImportManuscriptVersion to false if output is not published', () => {
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
          canImportManuscriptVersion: false,
        }),
      );
    });

    it('sets canImportManuscriptVersion to false if output is not linked to a manuscript', () => {
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
          canImportManuscriptVersion: false,
        }),
      );
    });

    it('sets canImportManuscriptVersion to true if all conditions are met', () => {
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
          canImportManuscriptVersion: true,
        }),
      );
    });
  });

  describe('canSwitchToDraft action', () => {
    it('sets canSwitchToDraft to false if user does not have publish permission', () => {
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
          canSwitchToDraft: false,
        }),
      );
    });

    it('sets canSwitchToDraft to false if output is published', () => {
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
          canSwitchToDraft: false,
        }),
      );
    });

    it('sets canSwitchToDraft to false if output is not in review', () => {
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
          canSwitchToDraft: false,
        }),
      );
    });

    it('sets canSwitchToDraft to true when all conditions are met', () => {
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
          canSwitchToDraft: true,
        }),
      );
    });
  });

  describe('canPublish action', () => {
    it('sets canPublish to false if user does not have publish permission', () => {
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
          canPublish: false,
        }),
      );
    });

    it('sets canPublish to false if output is already published', () => {
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
          canPublish: false,
        }),
      );
    });

    it('sets canPublish to true if output is not published and user has publish permission', () => {
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
          canPublish: true,
        }),
      );
    });
  });
});
