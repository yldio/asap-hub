import {
  ResearchOutputPostRequest,
  ResearchOutputResponse,
  ResearchOutputWorkingGroupPostRequest,
  ResearchOutputWorkingGroupResponse,
} from '@asap-hub/model/src/research-output';

export const isResearchOutputWorkingGroup = (
  researchOutputData: Pick<ResearchOutputResponse, 'workingGroups'>,
): researchOutputData is ResearchOutputWorkingGroupResponse =>
  !!researchOutputData.workingGroups.length;

export const isResearchOutputWorkingGroupRequest = (
  researchOutputData: Pick<ResearchOutputPostRequest, 'workingGroups'>,
): researchOutputData is ResearchOutputWorkingGroupPostRequest =>
  !!researchOutputData.workingGroups.length;
