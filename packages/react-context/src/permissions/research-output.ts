import {
  getResearchOutputFlowBehavior,
  ResearchOutputDocumentType,
  ResearchOutputFlowId,
} from '@asap-hub/model';
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

export type ResearchOutputDetailActionAvailability = {
  showEdit: boolean;
  showDuplicate: boolean;
  showRequestReview: boolean;
  showAddVersion: boolean;
  showImportManuscriptVersion: boolean;
  showSwitchToDraft: boolean;
  showPublish: boolean;
};

export type ResearchOutputAvailableActions = {
  canSaveDraft: boolean;
  showImpactAndCategory: boolean;
};

export const resolveResearchOutputAvailableActions = ({
  flowId,
  permissions,
  documentType,
}: {
  flowId: ResearchOutputFlowId;
  permissions: ResearchOutputPermissions;
  documentType: ResearchOutputDocumentType;
}): ResearchOutputAvailableActions => {
  const { supportsDrafts } = getResearchOutputFlowBehavior(flowId);
  return {
    canSaveDraft: supportsDrafts && !!permissions.canShareResearchOutput,
    showImpactAndCategory: documentType === 'Article',
  };
};

export type ResearchOutputDetailState = {
  published: boolean;
  isInReview: boolean;
  hasRelatedManuscript: boolean;
  isWorkingGroupOutput: boolean;
  isGrantDocument: boolean;
};

export const getVisibleResearchOutputActions = (
  permissions: ResearchOutputPermissions,
  state: ResearchOutputDetailState,
): ResearchOutputDetailActionAvailability => {
  if (state.isGrantDocument) {
    return {
      showEdit: false,
      showDuplicate: false,
      showRequestReview: false,
      showAddVersion: false,
      showImportManuscriptVersion: false,
      showSwitchToDraft: false,
      showPublish: false,
    };
  }
  return {
    showEdit:
      !!permissions.canEditResearchOutput &&
      (!state.isInReview || !!permissions.canPublishResearchOutput),
    showDuplicate:
      !!permissions.canDuplicateResearchOutput &&
      (state.isWorkingGroupOutput || !state.hasRelatedManuscript),
    showRequestReview:
      !state.published && !!permissions.canRequestReview && !state.isInReview,
    showAddVersion:
      !!permissions.canVersionResearchOutput &&
      state.published &&
      !state.hasRelatedManuscript,
    showImportManuscriptVersion:
      !!permissions.canVersionResearchOutput &&
      state.published &&
      state.hasRelatedManuscript,
    showSwitchToDraft:
      !state.published &&
      state.isInReview &&
      !!permissions.canPublishResearchOutput,
    showPublish: !state.published && !!permissions.canPublishResearchOutput,
  };
};
