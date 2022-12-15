import { Frame } from '@asap-hub/frontend-utils';
import {
  ResearchOutputDocumentType,
  ResearchOutputResponse,
  ResearchOutputPublishingEntities,
} from '@asap-hub/model';
import { NotFoundPage, ResearchOutputPage } from '@asap-hub/react-components';
import {
  network,
  OutputDocumentTypeParameter,
  useRouteParams,
} from '@asap-hub/routing';
import React, { useContext } from 'react';
import { ResearchOutputPermissionsContext } from '@asap-hub/react-context';
import researchSuggestions from '../teams/research-suggestions';
import {
  useAuthorSuggestions,
  useLabSuggestions,
  useWorkingGroupById,
  useTeamSuggestions,
} from './state';
import { useResearchTags } from '../teams/state';

const useParamOutputDocumentType = (
  workingGroupId: string,
): OutputDocumentTypeParameter => {
  const route = network({})
    .workingGroups({})
    .workingGroup({ workingGroupId }).createOutput;
  const { outputDocumentType } = useRouteParams(route);
  return outputDocumentType;
};

export function paramOutputDocumentTypeToResearchOutputDocumentType(
  data: OutputDocumentTypeParameter,
): ResearchOutputDocumentType {
  switch (data) {
    case 'article':
      return 'Article';
    default:
      return 'Article';
  }
}

type WorkingGroupOutputProps = {
  workingGroupId: string;
  researchOutputData?: ResearchOutputResponse;
};
const WorkingGroupOutput: React.FC<WorkingGroupOutputProps> = ({
  workingGroupId,
  researchOutputData,
}) => {
  const paramOutputDocumentType = useParamOutputDocumentType(workingGroupId);
  const documentType = paramOutputDocumentTypeToResearchOutputDocumentType(
    paramOutputDocumentType,
  );
  const workingGroup = useWorkingGroupById(workingGroupId);
  const { canCreateUpdate } = useContext(ResearchOutputPermissionsContext);

  const getLabSuggestions = useLabSuggestions();
  const getAuthorSuggestions = useAuthorSuggestions();
  const getTeamSuggestions = useTeamSuggestions();
  const researchTags = useResearchTags();
  const publishingEntity: ResearchOutputPublishingEntities = 'Working Group';

  if (canCreateUpdate && workingGroup) {
    return (
      <Frame title="Share Working Group Research Output">
        <ResearchOutputPage
          tagSuggestions={researchSuggestions.map((suggestion) => ({
            label: suggestion,
            value: suggestion,
          }))}
          documentType={documentType}
          getLabSuggestions={getLabSuggestions}
          getAuthorSuggestions={(input) =>
            getAuthorSuggestions(input).then((users) =>
              users.map((user) => ({
                user,
                label: user.displayName,
                value: user.id,
              })),
            )
          }
          getTeamSuggestions={getTeamSuggestions}
          researchTags={researchTags}
          researchOutputData={researchOutputData}
          isEditMode={false}
          publishingEntity={publishingEntity}
          onSave={() => Promise.resolve()}
        />
      </Frame>
    );
  }
  return <NotFoundPage />;
};

export default WorkingGroupOutput;
