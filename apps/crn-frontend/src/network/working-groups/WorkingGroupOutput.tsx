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
import React, { useState } from 'react';
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
import { useResearchOutputPermissions } from '../../shared-research/state';

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

  const createResearchOutput = usePostResearchOutput({ publish: true });
  const createDraftResearchOutput = usePostResearchOutput({ publish: false });
  const updateResearchOutput = usePutResearchOutput();

  const getLabSuggestions = useLabSuggestions();
  const getAuthorSuggestions = useAuthorSuggestions();
  const getTeamSuggestions = useTeamSuggestions();
  const researchTags = useResearchTags();

  const published = researchOutputData ? !!researchOutputData.published : false;

  const permissions = useResearchOutputPermissions(
    'workingGroups',
    [workingGroupId],
    published,
  );

  if (permissions.canEditResearchOutput && workingGroup) {
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
          permissions={permissions}
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
              ? updateResearchOutput(researchOutputData.id, {
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
