import {
  getResearchOutputFlowBehavior,
  ResearchOutputDocumentType,
  ResearchOutputFlowId,
  ResearchOutputResponse,
  ResearchOutputVersion,
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
  disableImpactAndCategory: boolean;
  disableDateMadePublic: boolean;
  canSaveDraft: boolean;
  showImpactAndCategory: boolean;
  showChangelogAndVersionHistory: boolean;
};

export const resolveResearchOutputAvailableActions = ({
  flowId,
  permissions,
  documentType,
  researchOutputData,
  versions = researchOutputData?.versions ?? [],
}: {
  flowId: ResearchOutputFlowId;
  permissions: ResearchOutputPermissions;
  documentType: ResearchOutputDocumentType;
  researchOutputData?: Pick<
    ResearchOutputResponse,
    'versions' | 'publishDate' | 'id'
  >;
  versions?: readonly ResearchOutputVersion[];
}): ResearchOutputAvailableActions => {
  const behavior = getResearchOutputFlowBehavior(flowId);

  return {
    disableImpactAndCategory: behavior.isAddVersionFlow,
    disableDateMadePublic:
      !!researchOutputData?.publishDate &&
      (behavior.isImportedFromManuscript || !!researchOutputData?.id),
    canSaveDraft:
      behavior.supportsDrafts && !!permissions.canShareResearchOutput,
    showImpactAndCategory: documentType === 'Article',
    showChangelogAndVersionHistory:
      (behavior.isAddVersionFlow || behavior.isEditFlow) && versions.length > 0,
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
