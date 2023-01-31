import { clearAjvErrorForPath, Frame } from '@asap-hub/frontend-utils';
import {
  ValidationErrorResponse,
  ResearchOutputResponse,
  researchOutputDocumentTypeToType,
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
import {
  usePostResearchOutput,
  usePutResearchOutput,
  useResearchTags,
} from '../teams/state';
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
  const route = network({})
    .workingGroups({})
    .workingGroup({ workingGroupId }).createOutput;
  const { workingGroupOutputDocumentType } = useRouteParams(route);
  const documentType = paramOutputDocumentTypeToResearchOutputDocumentType(
    workingGroupOutputDocumentType,
  );

  const workingGroup = useWorkingGroupById(workingGroupId);

  const [errors, setErrors] = useState<ValidationErrorResponse['data']>([]);

  const { canCreateUpdate } = useContext(ResearchOutputPermissionsContext);

  const createResearchOutput = usePostResearchOutput();
  const updateResearchOutput = usePutResearchOutput();

  const getLabSuggestions = useLabSuggestions();
  const getAuthorSuggestions = useAuthorSuggestions();
  const getTeamSuggestions = useTeamSuggestions();
  const researchTags = useResearchTags();

  if (canCreateUpdate && workingGroup) {
    return (
      <Frame title="Share Working Group Research Output">
        <ResearchOutputHeader
          documentType={documentType}
          publishingEntity="Working Group"
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
          getTeamSuggestions={getTeamSuggestions}
          researchTags={researchTags}
          serverValidationErrors={errors}
          clearServerValidationError={(instancePath: string) =>
            setErrors(clearAjvErrorForPath(errors, instancePath))
          }
          researchOutputData={researchOutputData}
          typeOptions={Array.from(
            researchOutputDocumentTypeToType[documentType],
          )}
          selectedTeams={(researchOutputData?.teams ?? []).map(
            ({ displayName, id }) => ({
              label: displayName,
              value: id,
            }),
          )}
          authorsRequired
          onSave={(output) =>
            researchOutputData
              ? updateResearchOutput(researchOutputData.id, {
                  ...output,
                  workingGroups: [workingGroupId],
                  publishingEntity: 'Working Group',
                }).catch(handleError(['/link', '/title'], setErrors))
              : createResearchOutput({
                  ...output,
                  workingGroups: [workingGroupId],
                  publishingEntity: 'Working Group',
                }).catch(handleError(['/link', '/title'], setErrors))
          }
        />
      </Frame>
    );
  }
  return <NotFoundPage />;
};

export default WorkingGroupOutput;
