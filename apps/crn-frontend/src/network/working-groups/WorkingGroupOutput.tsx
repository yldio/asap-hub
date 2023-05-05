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
  useRelatedResearchSuggestions,
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

  const documentType =
    researchOutputData?.documentType ||
    paramOutputDocumentTypeToResearchOutputDocumentType(
      workingGroupOutputDocumentType,
    );

  const workingGroup = useWorkingGroupById(workingGroupId);

  const [errors, setErrors] = useState<ValidationErrorResponse['data']>([]);

  const createResearchOutput = usePostResearchOutput();
  const updateResearchOutput = usePutResearchOutput();
  const updateAndPublishResearchOutput = usePutResearchOutput(true);

  const getLabSuggestions = useLabSuggestions();
  const getAuthorSuggestions = useAuthorSuggestions();
  const getTeamSuggestions = useTeamSuggestions();
  const getRelatedResearchSuggestions = useRelatedResearchSuggestions();
  const researchTags = useResearchTags();

  const published = researchOutputData ? !!researchOutputData.published : false;

  const permissions = useResearchOutputPermissions(
    'workingGroups',
    [workingGroupId],
    published,
  );

  const researchSuggestions = researchTags
    .filter((tag) => tag.category === 'Keyword')
    .map((keyword) => keyword.name);

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
            getAuthorSuggestions(input).then((authors) =>
              authors.map((author) => ({
                author,
                label: author.displayName,
                value: author.id,
              })),
            )
          }
          getTeamSuggestions={getTeamSuggestions}
          getRelatedResearchSuggestions={getRelatedResearchSuggestions}
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
              ? updateAndPublishResearchOutput(researchOutputData.id, {
                  ...output,
                  workingGroups: [workingGroupId],
                  published: true,
                }).catch(handleError(['/link', '/title'], setErrors))
              : createResearchOutput({
                  ...output,
                  workingGroups: [workingGroupId],
                  published: true,
                }).catch(handleError(['/link', '/title'], setErrors))
          }
          onSaveDraft={(output) =>
            researchOutputData
              ? updateResearchOutput(researchOutputData.id, {
                  ...output,
                  workingGroups: [workingGroupId],
                  published: false,
                }).catch(handleError(['/link', '/title'], setErrors))
              : createResearchOutput({
                  ...output,
                  workingGroups: [workingGroupId],
                  published: false,
                }).catch(handleError(['/link', '/title'], setErrors))
          }
        />
      </Frame>
    );
  }

  return <NotFoundPage />;
};

export default WorkingGroupOutput;
