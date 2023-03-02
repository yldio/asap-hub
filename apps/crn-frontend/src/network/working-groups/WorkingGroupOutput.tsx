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
import { useWorkingGroupById } from './state';
import {
  handleError,
  paramOutputDocumentTypeToResearchOutputDocumentType,
  useAuthorSuggestions,
  useLabSuggestions,
  useTeamSuggestions,
  useResearchTags,
  usePostResearchOutput,
  usePutResearchOutput,
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

  const { canEditResearchOutput } = useContext(
    ResearchOutputPermissionsContext,
  );
  const createResearchOutput = usePostResearchOutput({ published: true });
  const createDraftResearchOutput = usePostResearchOutput({ published: false });
  const updateResearchOutput = usePutResearchOutput({ published: true });
  const updateDraftResearchOutput = usePutResearchOutput({ published: false });

  const getLabSuggestions = useLabSuggestions();
  const getAuthorSuggestions = useAuthorSuggestions();
  const getTeamSuggestions = useTeamSuggestions();
  const researchTags = useResearchTags();

  const published = researchOutputData ? !!researchOutputData.published : false;

  if (canEditResearchOutput && workingGroup) {
    return (
      <Frame title="Share Working Group Research Output">
        <ResearchOutputHeader
          documentType={documentType}
          workingGroupAssociation
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
          published={published}
          onSave={(output) =>
            researchOutputData
              ? updateResearchOutput(researchOutputData.id, {
                  ...output,
                  workingGroups: [workingGroupId],
                }).catch(handleError(['/link', '/title'], setErrors))
              : createResearchOutput({
                  ...output,
                  workingGroups: [workingGroupId],
                }).catch(handleError(['/link', '/title'], setErrors))
          }
          onSaveDraft={(output) =>
            researchOutputData
              ? updateDraftResearchOutput(researchOutputData.id, {
                  ...output,
                  workingGroups: [workingGroupId],
                }).catch(handleError(['/link', '/title'], setErrors))
              : createDraftResearchOutput({
                  ...output,
                  workingGroups: [workingGroupId],
                }).catch(handleError(['/link', '/title'], setErrors))
          }
        />
      </Frame>
    );
  }
  return <NotFoundPage />;
};

export default WorkingGroupOutput;
