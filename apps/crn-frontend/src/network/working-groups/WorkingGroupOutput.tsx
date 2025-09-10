import { clearAjvErrorForPath, Frame } from '@asap-hub/frontend-utils';
import {
  researchOutputDocumentTypeToType,
  ResearchOutputResponse,
  ResearchOutputVersion,
  ValidationErrorResponse,
} from '@asap-hub/model';
import {
  NotFoundPage,
  OutputVersions,
  ResearchOutputForm,
  ResearchOutputHeader,
  Toast,
  usePrevious,
} from '@asap-hub/react-components';
import { InnerToastContext } from '@asap-hub/react-context';
import { network, useRouteParams } from '@asap-hub/routing';
import React, {
  ComponentProps,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { useResearchOutputPermissions } from '../../shared-research/state';
import {
  handleError,
  paramOutputDocumentTypeToResearchOutputDocumentType,
  useAuthorSuggestions,
  useGeneratedContent,
  useImpactSuggestions,
  useCategorySuggestions,
  useLabSuggestions,
  usePostResearchOutput,
  usePutResearchOutput,
  useRelatedEventsSuggestions,
  useRelatedResearchSuggestions,
  useResearchTags,
  useTeamSuggestions,
} from '../../shared-state';
import { useWorkingGroupById } from './state';

type WorkingGroupOutputProps = {
  workingGroupId: string;
  researchOutputData?: ResearchOutputResponse;
  versionAction?: 'create' | 'edit';
  isDuplicate?: boolean;
} & Pick<
  ComponentProps<typeof ResearchOutputForm>,
  'descriptionUnchangedWarning'
>;
const WorkingGroupOutput: React.FC<WorkingGroupOutputProps> = ({
  workingGroupId,
  researchOutputData,
  descriptionUnchangedWarning,
  versionAction,
  isDuplicate = false,
}) => {
  const route = network({})
    .workingGroups({})
    .workingGroup({ workingGroupId }).createOutput;
  const { outputDocumentType } = useRouteParams(route);

  const documentType =
    researchOutputData?.documentType ||
    paramOutputDocumentTypeToResearchOutputDocumentType(outputDocumentType);

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

  const getImpactSuggestions = useImpactSuggestions();
  const getCategorySuggestions = useCategorySuggestions();
  const getLabSuggestions = useLabSuggestions();
  const getAuthorSuggestions = useAuthorSuggestions();
  const getTeamSuggestions = useTeamSuggestions();
  const getRelatedResearchSuggestions = useRelatedResearchSuggestions(
    researchOutputData?.id,
  );
  const getRelatedEventSuggestions = useRelatedEventsSuggestions();
  const getShortDescriptionFromDescription = useGeneratedContent();
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

  let versions: ResearchOutputVersion[] = [];
  if (versionAction === 'create') {
    const researchOutputAsVersion: ResearchOutputVersion = {
      id: researchOutputData?.id ?? '',
      title: researchOutputData?.title ?? '',
      documentType: researchOutputData?.documentType ?? 'Article',
      type: researchOutputData?.type,
      link: researchOutputData?.link,
      addedDate: researchOutputData?.addedDate,
    };

    versions = researchOutputData?.versions
      ? researchOutputData.versions.concat([researchOutputAsVersion])
      : [researchOutputAsVersion];
  } else if (versionAction === 'edit') {
    versions = researchOutputData?.versions ?? [];
  }

  if (workingGroup) {
    return (
      <Frame title="Share Working Group Research Output">
        {versionAction === 'create' && (
          <Toast accent="warning">
            The previous output page will be replaced with a summarised version
            history section.
          </Toast>
        )}
        <InnerToastContext.Provider value={toast}>
          {toastNode && <Toast accent="error">{toastNode}</Toast>}
          <ResearchOutputHeader
            documentType={documentType}
            workingGroupAssociation
          />
          {versionAction && versions.length > 0 && (
            <OutputVersions
              app="crn"
              versions={versions}
              versionAction={versionAction}
            />
          )}
          <ResearchOutputForm
            displayChangelog={Boolean(
              versionAction === 'create' || versions.length > 0,
            )}
            versionAction={versionAction}
            tagSuggestions={researchSuggestions}
            documentType={documentType}
            getImpactSuggestions={getImpactSuggestions}
            getCategorySuggestions={getCategorySuggestions}
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
            getShortDescriptionFromDescription={
              getShortDescriptionFromDescription
            }
            getRelatedEventSuggestions={getRelatedEventSuggestions}
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
            descriptionUnchangedWarning={descriptionUnchangedWarning}
            isDuplicate={isDuplicate}
            onSave={(output) =>
              researchOutputData?.id
                ? updateAndPublishResearchOutput(researchOutputData.id, {
                    ...output,
                    workingGroups: [workingGroupId],
                    published: true,
                    createVersion: versionAction === 'create',
                    statusChangedById: researchOutputData.statusChangedBy?.id,
                    isInReview: researchOutputData.isInReview,
                  }).catch(handleError(['/link', '/title'], setErrors))
                : createResearchOutput({
                    ...output,
                    workingGroups: [workingGroupId],
                    published: true,
                    isDuplicate,
                  }).catch(handleError(['/link', '/title'], setErrors))
            }
            onSaveDraft={(output) =>
              researchOutputData?.id
                ? updateResearchOutput(researchOutputData.id, {
                    ...output,
                    workingGroups: [workingGroupId],
                    published: false,
                    statusChangedById: researchOutputData.statusChangedBy?.id,
                    isInReview: researchOutputData.isInReview,
                  }).catch(handleError(['/link', '/title'], setErrors))
                : createResearchOutput({
                    ...output,
                    workingGroups: [workingGroupId],
                    published: false,
                    isDuplicate,
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
