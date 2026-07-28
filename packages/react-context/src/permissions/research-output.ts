import {
  getResearchOutputFlowBehavior,
  ResearchOutputDocumentType,
  ResearchOutputFlowId,
  ResearchOutputResponse,
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

type ResolveResearchOutputAvailableActionsInput = {
  flowId: ResearchOutputFlowId;
  permissions: ResearchOutputPermissions;
  researchOutputData: ResearchOutputResponse | undefined;
  documentType: ResearchOutputDocumentType;
  versions: readonly unknown[];
  isImportedFromManuscript: boolean;
};

export type ResearchOutputAvailableActions = {
  disableDateMadePublic: boolean;
  disableImpactAndCategory: boolean;
  disableNonPublicSharingStatus: boolean;
  disableUsedInPublication: boolean;
  showCatalogNumber: boolean;
  showChangelog: boolean;
  showIdentifierSection: boolean;
  showImpactAndCategory: boolean;
  showSaveDraftButton: boolean;
  showVersionHistory: boolean;
};

export const resolveResearchOutputAvailableActions = ({
  flowId,
  permissions,
  researchOutputData,
  documentType,
  versions,
  isImportedFromManuscript,
}: ResolveResearchOutputAvailableActionsInput): ResearchOutputAvailableActions => {
  const behavior = getResearchOutputFlowBehavior(flowId);
  return {
    disableDateMadePublic:
      !!researchOutputData?.publishDate &&
      (isImportedFromManuscript || !!researchOutputData?.id),
    disableImpactAndCategory: behavior.isAddVersionFlow,

    disableNonPublicSharingStatus:
      (documentType === 'Article' &&
        researchOutputData?.sharingStatus === undefined) ||
      isImportedFromManuscript,
    disableUsedInPublication:
      behavior.isCreateFlow &&
      documentType === 'Article' &&
      researchOutputData?.usedInPublication === undefined,
    showCatalogNumber: documentType === 'Lab Material',
    showChangelog:
      behavior.isAddVersionFlow ||
      (researchOutputData?.versions ?? []).length > 0,
    showIdentifierSection: documentType !== 'Report',
    showImpactAndCategory: documentType === 'Article',
    showSaveDraftButton:
      behavior.supportsDrafts && !!permissions.canShareResearchOutput,
    showVersionHistory:
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
