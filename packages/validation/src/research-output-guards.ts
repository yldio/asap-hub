import {
  ResearchOutputResponse,
  ResearchOutputPostRequest,
} from '@asap-hub/model/src/research-output';

export const isTeamResearchOutput = (
  researchOutputData: ResearchOutputResponse | ResearchOutputPostRequest,
): boolean => {
  if (researchOutputData.workingGroups.length > 0) {
    return false;
  }
  return true;
};
