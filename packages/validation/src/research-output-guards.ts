import {
  ResearchOutputResponse,
  ResearchOutputWorkingGroupResponse,
} from '@asap-hub/model/src/research-output';

export const isResearchOutputWorkingGroup = (
  researchOutputData: Pick<ResearchOutputResponse, 'workingGroups'>,
): researchOutputData is ResearchOutputWorkingGroupResponse =>
  !!researchOutputData.workingGroups.length;
