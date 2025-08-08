import { isEnabled } from '@asap-hub/flags';
import { clearAjvErrorForPath, Frame } from '@asap-hub/frontend-utils';
import {
  researchOutputDocumentTypeToType,
  ResearchOutputResponse,
  ResearchOutputVersion,
  ValidationErrorResponse,
} from '@asap-hub/model';
import {
  ManuscriptOutputSelection,
  ManuscriptVersionImportCard,
  ManuscriptVersionOption,
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
import { mapManuscriptVersionToResearchOutput } from '../../shared-research/util';
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
import { useManuscriptVersionSuggestions } from '../teams/state';
import { useWorkingGroupById } from './state';

type WorkingGroupOutputProps = {
  workingGroupId: string;
  researchOutputData?: ResearchOutputResponse;
  versionAction?: 'create' | 'edit';
} & Pick<
  ComponentProps<typeof ResearchOutputForm>,
  'descriptionUnchangedWarning'
>;
const WorkingGroupOutput: React.FC<WorkingGroupOutputProps> = ({
  workingGroupId,
  researchOutputData,
  descriptionUnchangedWarning,
  versionAction,
}) => {
  const [selectedManuscriptVersion, setManuscriptVersion] =
    useState<ManuscriptVersionOption>();
  const [manuscriptOutputSelection, setManuscriptOutputSelection] = useState<
    'manually' | 'import' | ''
  >('');
  const [updatedOutput, setUpdatedOutput] = useState<
    ResearchOutputResponse | undefined
  >(researchOutputData);

  const route = network({})
    .workingGroups({})
    .workingGroup({ workingGroupId }).createOutput;
  const { outputDocumentType } = useRouteParams(route);

  const documentType =
    updatedOutput?.documentType ||
    paramOutputDocumentTypeToResearchOutputDocumentType(outputDocumentType);

  const workingGroup = useWorkingGroupById(workingGroupId);

  const [errors, setErrors] = useState<ValidationErrorResponse['data']>([]);
  const previousErrors = usePrevious(errors);

  const [toastNode, setToastNode] = useState<ReactNode>(undefined);
  const toast = useCallback((node: ReactNode) => setToastNode(node), []);
  const previousToast = usePrevious(toastNode);

  useEffect(() => {
    if (selectedManuscriptVersion && selectedManuscriptVersion.version) {
      const manuscriptVersion = selectedManuscriptVersion.version;
      setUpdatedOutput((prev) =>
        mapManuscriptVersionToResearchOutput(
          prev,
          manuscriptVersion,
          'Working Group',
        ),
      );
    }
  }, [selectedManuscriptVersion]);

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
    updatedOutput?.id,
  );
  const getRelatedEventSuggestions = useRelatedEventsSuggestions();
  const getShortDescriptionFromDescription = useGeneratedContent();
  const getManuscriptVersionSuggestions = useManuscriptVersionSuggestions();
  const researchTags = useResearchTags();

  const published = updatedOutput ? !!updatedOutput.published : false;

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
      id: updatedOutput?.id ?? '',
      title: updatedOutput?.title ?? '',
      documentType: updatedOutput?.documentType ?? 'Article',
      type: updatedOutput?.type,
      link: updatedOutput?.link,
      addedDate: updatedOutput?.addedDate,
    };

    versions = updatedOutput?.versions
      ? updatedOutput.versions.concat([researchOutputAsVersion])
      : [researchOutputAsVersion];
  } else if (versionAction === 'edit') {
    versions = updatedOutput?.versions ?? [];
  }
  const isManuscriptOutputFlagEnabled = isEnabled('MANUSCRIPT_OUTPUTS');
  const [showManuscriptOutputFlow, setShowManuscriptOutputFlow] = useState(
    isManuscriptOutputFlagEnabled &&
      documentType === 'Article' &&
      !updatedOutput?.id,
  );

  const handleManuscriptOutputSelection = (
    selection: 'manually' | 'import' | '',
  ) => {
    setManuscriptOutputSelection(selection);
  };
  if (workingGroup) {
    if (showManuscriptOutputFlow) {
      return (
        <Frame title="Share Research Output">
          <ResearchOutputHeader
            documentType={documentType}
            workingGroupAssociation
          />
          <ManuscriptOutputSelection
            manuscriptOutputSelection={manuscriptOutputSelection}
            onChangeManuscriptOutputSelection={handleManuscriptOutputSelection}
            onSelectCreateManually={() => setShowManuscriptOutputFlow(false)}
            getManuscriptVersionOptions={(input) =>
              getManuscriptVersionSuggestions(input).then(
                (versionSuggestions) =>
                  versionSuggestions.map((version) => ({
                    version,
                    label: version.title,
                    value: version.id,
                  })),
              )
            }
            selectedVersion={selectedManuscriptVersion}
            setSelectedVersion={setManuscriptVersion}
            onImportManuscript={() => {
              setShowManuscriptOutputFlow(false);
            }}
          />
        </Frame>
      );
    }

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
          {selectedManuscriptVersion && selectedManuscriptVersion.version && (
            <ManuscriptVersionImportCard
              version={selectedManuscriptVersion.version}
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
            researchOutputData={updatedOutput}
            typeOptions={Array.from(
              researchOutputDocumentTypeToType[documentType],
            )}
            selectedTeams={(updatedOutput?.teams ?? []).map(
              ({ displayName, id }) => ({
                label: displayName,
                value: id,
              }),
            )}
            authorsRequired
            published={published}
            permissions={permissions}
            descriptionUnchangedWarning={descriptionUnchangedWarning}
            onSave={(output) =>
              updatedOutput?.id
                ? updateAndPublishResearchOutput(updatedOutput.id, {
                    ...output,
                    workingGroups: [workingGroupId],
                    published: true,
                    createVersion: versionAction === 'create',
                    relatedManuscriptVersion:
                      versionAction === 'create'
                        ? undefined
                        : updatedOutput.relatedManuscriptVersion,
                    statusChangedById: updatedOutput.statusChangedBy?.id,
                    isInReview: updatedOutput.isInReview,
                  }).catch(handleError(['/link', '/title'], setErrors))
                : createResearchOutput({
                    ...output,
                    workingGroups: [workingGroupId],
                    published: true,
                    relatedManuscriptVersion:
                      updatedOutput?.relatedManuscriptVersion,
                    relatedManuscript: updatedOutput?.relatedManuscript,
                  }).catch(handleError(['/link', '/title'], setErrors))
            }
            onSaveDraft={(output) =>
              updatedOutput?.id
                ? updateResearchOutput(updatedOutput.id, {
                    ...output,
                    workingGroups: [workingGroupId],
                    published: false,
                    relatedManuscriptVersion:
                      updatedOutput.relatedManuscriptVersion,
                    statusChangedById: updatedOutput.statusChangedBy?.id,
                    isInReview: updatedOutput.isInReview,
                  }).catch(handleError(['/link', '/title'], setErrors))
                : createResearchOutput({
                    ...output,
                    workingGroups: [workingGroupId],
                    published: false,
                    relatedManuscriptVersion:
                      updatedOutput?.relatedManuscriptVersion,
                    relatedManuscript: updatedOutput?.relatedManuscript,
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
