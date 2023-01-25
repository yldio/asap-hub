import { clearAjvErrorForPath, Frame } from '@asap-hub/frontend-utils';
import {
  researchOutputDocumentTypeToType,
  ResearchOutputResponse,
  ValidationErrorResponse,
} from '@asap-hub/model';
import {
  NotFoundPage,
  ResearchOutputForm,
  ResearchOutputHeader,
} from '@asap-hub/react-components';
import { network, useRouteParams } from '@asap-hub/routing';
import React, { useContext, useState } from 'react';
import { ResearchOutputPermissionsContext } from '@asap-hub/react-context';
import researchSuggestions from '../teams/research-suggestions';
import {
  useAuthorSuggestions,
  useLabSuggestions,
  useWorkingGroupById,
  useTeamSuggestions,
} from './state';
import { usePostResearchOutput, useResearchTags } from '../teams/state';
import {
  handleError,
  paramOutputDocumentTypeToResearchOutputDocumentType,
} from '../../shared-research';

type WorkingGroupOutputProps = {
  workingGroupId: string;
  researchOutputData?: ResearchOutputResponse;
};
const WorkingGroupOutput: React.FC<WorkingGroupOutputProps> = ({
  workingGroupId,
  researchOutputData,
}) => {
  const [errors, setErrors] = useState<ValidationErrorResponse['data']>([]);

  const workingGroup = useWorkingGroupById(workingGroupId);
  const { canCreateUpdate } = useContext(ResearchOutputPermissionsContext);

  const getLabSuggestions = useLabSuggestions();
  const getAuthorSuggestions = useAuthorSuggestions();
  const getTeamSuggestions = useTeamSuggestions();
  const researchTags = useResearchTags();
  const createResearchOutput = usePostResearchOutput();
  const route = network({})
    .workingGroups({})
    .workingGroup({ workingGroupId }).createOutput;
  const { workingGroupOutputDocumentType } = useRouteParams(route);
  const documentType = paramOutputDocumentTypeToResearchOutputDocumentType(
    workingGroupOutputDocumentType,
  );

  if (canCreateUpdate && workingGroup) {
    return (
      <Frame title="Share Working Group Research Output">
        <ResearchOutputHeader
          documentType={documentType}
          publishingEntity={'Working Group'}
        />
        <ResearchOutputForm
          tagSuggestions={researchSuggestions}
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
          typeOptions={[
            ...researchOutputDocumentTypeToType[documentType].values(),
          ]}
          selectedTeams={[]}
          getTeamSuggestions={getTeamSuggestions}
          researchTags={researchTags}
          researchOutputData={researchOutputData}
          serverValidationErrors={errors}
          clearServerValidationError={(instancePath: string) =>
            setErrors(clearAjvErrorForPath(errors, instancePath))
          }
          onSave={(output) =>
            createResearchOutput({
              ...output,
              publishingEntity: 'Working Group',
            }).catch(handleError(['/link', '/title'], setErrors))
          }
          descriptionTip="Add an abstract or a summary that describes this work."
        />
      </Frame>
    );
  }
  return <NotFoundPage />;
};

export default WorkingGroupOutput;
