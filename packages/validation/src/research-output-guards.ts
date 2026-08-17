import {
  ResearchOutputEntityType,
  ResearchOutputPostRequest,
  ResearchOutputPublishingEntities,
  ResearchOutputResponse,
  ResearchOutputWorkingGroupPostRequest,
  ResearchOutputWorkingGroupResponse,
} from '@asap-hub/model/src/research-output';

const publishingEntityToEntityType: Record<
  ResearchOutputPublishingEntities,
  ResearchOutputEntityType
> = {
  'Working Group': 'working-group',
  Project: 'project',
  Team: 'team',
};

export const getResearchOutputEntityType = (
  researchOutputData: Pick<ResearchOutputResponse, 'publishingEntity'>,
): ResearchOutputEntityType =>
  publishingEntityToEntityType[researchOutputData.publishingEntity];

export const isResearchOutputWorkingGroup = (
  researchOutputData: ResearchOutputResponse,
): researchOutputData is ResearchOutputWorkingGroupResponse =>
  getResearchOutputEntityType(researchOutputData) === 'working-group';

export const isResearchOutputProject = (
  researchOutputData: ResearchOutputResponse,
): researchOutputData is ResearchOutputResponse & {
  project: NonNullable<ResearchOutputResponse['project']>;
} => getResearchOutputEntityType(researchOutputData) === 'project';

export const isResearchOutputWorkingGroupRequest = (
  researchOutputData: Pick<ResearchOutputPostRequest, 'workingGroups'>,
): researchOutputData is ResearchOutputWorkingGroupPostRequest =>
  !!researchOutputData.workingGroups.length;
