import { FLOW_REGISTRY, ResearchOutputFlowId } from '@asap-hub/model';
import { createContext, useContext } from 'react';

export type ResearchOutputPermissions = {
  canShareResearchOutput?: boolean;
  canEditResearchOutput?: boolean;
  canPublishResearchOutput?: boolean;
  canDuplicateResearchOutput?: boolean;
  canVersionResearchOutput?: boolean;
  canRequestReview?: boolean;
};

export const ResearchOutputPermissionsContext =
  createContext<ResearchOutputPermissions>({
    canShareResearchOutput: false,
    canEditResearchOutput: false,
    canPublishResearchOutput: false,
    canDuplicateResearchOutput: false,
    canVersionResearchOutput: false,
    canRequestReview: false,
  });

export const useResearchOutputPermissionsContext =
  (): ResearchOutputPermissions => useContext(ResearchOutputPermissionsContext);

export type ResearchOutputAvailableActions = {
  canSaveDraft: boolean;
};

export type ResearchOutputDetailActionAvailability = {
  canEdit: boolean;
  canDuplicate: boolean;
  canRequestReview: boolean;
  canAddVersion: boolean;
  canImportManuscriptVersion: boolean;
  canSwitchToDraft: boolean;
  canPublish: boolean;
};

export const resolveResearchOutputAvailableActions = ({
  flowId,
  permissions,
}: {
  flowId: ResearchOutputFlowId;
  permissions: ResearchOutputPermissions;
}): ResearchOutputAvailableActions => {
  const flow = FLOW_REGISTRY[flowId];
  return {
    canSaveDraft: flow.supportsDrafts && !!permissions.canShareResearchOutput,
  };
};

export type ResearchOutputDetailState = {
  published: boolean;
  isInReview: boolean;
  hasRelatedManuscript: boolean;
  isWorkingGroupOutput: boolean;
};

export const getVisibleResearchOutputActions = (
  permissions: ResearchOutputPermissions,
  state: ResearchOutputDetailState,
): ResearchOutputDetailActionAvailability => ({
  canEdit:
    !!permissions.canEditResearchOutput &&
    (!state.isInReview || !!permissions.canPublishResearchOutput),
  canDuplicate:
    !!permissions.canDuplicateResearchOutput &&
    (state.isWorkingGroupOutput || !state.hasRelatedManuscript),
  canRequestReview:
    !state.published && !!permissions.canRequestReview && !state.isInReview,
  canAddVersion:
    !!permissions.canVersionResearchOutput &&
    state.published &&
    !state.hasRelatedManuscript,
  canImportManuscriptVersion:
    !!permissions.canVersionResearchOutput &&
    state.published &&
    state.hasRelatedManuscript,
  canSwitchToDraft:
    !state.published &&
    state.isInReview &&
    !!permissions.canPublishResearchOutput,
  canPublish: !state.published && !!permissions.canPublishResearchOutput,
});
