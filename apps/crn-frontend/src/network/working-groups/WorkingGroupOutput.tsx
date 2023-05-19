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
  Toast,
  usePrevious,
} from '@asap-hub/react-components';
import { InnerToastContext } from '@asap-hub/react-context';
import { network, useRouteParams } from '@asap-hub/routing';
import React, { ReactNode, useCallback, useEffect, useState } from 'react';
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
  const previousErrors = usePrevious(errors);

  const [toastNode, setToastNode] = useState<ReactNode>(undefined);
  const toast = useCallback((node: ReactNode) => setToastNode(node), []);
  const previousToast = usePrevious(toastNode);

  useEffect(() => {
    if (
      toastNode !== previousToast ||
      (previousErrors && previousErrors?.length < errors.length)
    ) {
      window.scrollTo(0, 0);
    }
  }, [toastNode, errors.length, previousErrors, previousToast]);

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

  if (permissions.canEditResearchOutput && workingGroup) {
    return (
      <Frame title="Share Working Group Research Output">
        <InnerToastContext.Provider value={toast}>
          {toastNode && <Toast accent="error">{toastNode}</Toast>}
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
        </InnerToastContext.Provider>
      </Frame>
    );
  }

  return <NotFoundPage />;
};

export default WorkingGroupOutput;
