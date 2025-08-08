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
import {
  network,
  OutputDocumentTypeParameter,
  useRouteParams,
} from '@asap-hub/routing';
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
  useCategorySuggestions,
  useGeneratedContent,
  useImpactSuggestions,
  useLabSuggestions,
  usePostResearchOutput,
  usePutResearchOutput,
  useRelatedEventsSuggestions,
  useRelatedResearchSuggestions,
  useResearchTags,
  useTeamSuggestions,
} from '../../shared-state';
import { useManuscriptVersionSuggestions, useTeamById } from './state';

const useParamOutputDocumentType = (
  teamId: string,
): OutputDocumentTypeParameter => {
  const route = network({}).teams({}).team({ teamId }).createOutput;
  const { outputDocumentType } = useRouteParams(route);
  return outputDocumentType;
};

type TeamOutputProps = {
  teamId: string;
  researchOutputData?: ResearchOutputResponse;
  versionAction?: 'create' | 'edit';
} & Pick<
  ComponentProps<typeof ResearchOutputForm>,
  'descriptionUnchangedWarning'
>;

const TeamOutput: React.FC<TeamOutputProps> = ({
  teamId,
  researchOutputData,
  descriptionUnchangedWarning,
  versionAction,
}) => {
  const [manuscriptOutputSelection, setManuscriptOutputSelection] = useState<
    'manually' | 'import' | ''
  >('');
  const [selectedManuscriptVersion, setManuscriptVersion] =
    useState<ManuscriptVersionOption>();
  const [updatedOutput, setUpdatedOutput] = useState<
    ResearchOutputResponse | undefined
  >(researchOutputData);

  const paramOutputDocumentType = useParamOutputDocumentType(teamId);
  const documentType =
    updatedOutput?.documentType ||
    paramOutputDocumentTypeToResearchOutputDocumentType(
      paramOutputDocumentType,
    );
  const team = useTeamById(teamId);
  const [errors, setErrors] = useState<ValidationErrorResponse['data']>([]);
  const previousErrors = usePrevious(errors);

  const [toastNode, setToastNode] = useState<ReactNode>(undefined);
  const toast = useCallback((node: ReactNode) => setToastNode(node), []);
  const previousToast = usePrevious(toastNode);

  useEffect(() => {
    if (selectedManuscriptVersion && selectedManuscriptVersion.version) {
      const manuscriptVersion = selectedManuscriptVersion.version;
      setUpdatedOutput((prev) =>
        mapManuscriptVersionToResearchOutput(prev, manuscriptVersion, 'Team'),
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
  const researchTags = useResearchTags();
  const getManuscriptVersionSuggestions = useManuscriptVersionSuggestions();

  const published = updatedOutput ? !!updatedOutput.published : false;

  const permissions = useResearchOutputPermissions(
    'teams',
    updatedOutput?.teams.map(({ id }) => id) ?? [teamId],
    published,
  );
  const getShortDescriptionFromDescription = useGeneratedContent();
  const researchSuggestions = researchTags
    .filter((tag) => tag.category === 'Keyword')
    .map((keyword) => keyword.name);

  const researchOutputAsVersion: ResearchOutputVersion = {
    id: updatedOutput?.id ?? '',
    title: updatedOutput?.title ?? '',
    documentType: updatedOutput?.documentType ?? 'Article',
    type: updatedOutput?.type,
    link: updatedOutput?.link,
    addedDate: updatedOutput?.addedDate,
  };

  let versions: ResearchOutputVersion[] = updatedOutput?.versions
    ? updatedOutput.versions.concat([researchOutputAsVersion])
    : [researchOutputAsVersion];

  if (versionAction === 'edit') {
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

  if (team) {
    if (showManuscriptOutputFlow) {
      return (
        <Frame title="Share Research Output">
          <ResearchOutputHeader
            documentType={documentType}
            workingGroupAssociation={false}
          />
          <ManuscriptOutputSelection
            manuscriptOutputSelection={manuscriptOutputSelection}
            onChangeManuscriptOutputSelection={handleManuscriptOutputSelection}
            onSelectCreateManually={() => setShowManuscriptOutputFlow(false)}
            selectedVersion={selectedManuscriptVersion}
            setSelectedVersion={setManuscriptVersion}
            onImportManuscript={() => {
              setShowManuscriptOutputFlow(false);
            }}
            getManuscriptVersionOptions={(input) =>
              getManuscriptVersionSuggestions(input, teamId).then(
                (versionSuggestions) =>
                  versionSuggestions.map((version) => ({
                    version,
                    label: version.title,
                    value: version.id,
                  })),
              )
            }
          />
        </Frame>
      );
    }
    return (
      <Frame title="Share Research Output">
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
            workingGroupAssociation={false}
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
              versionAction === 'create' ||
                (updatedOutput?.versions || []).length > 0,
            )}
            versionAction={versionAction}
            tagSuggestions={researchSuggestions}
            documentType={documentType}
            getLabSuggestions={getLabSuggestions}
            getImpactSuggestions={getImpactSuggestions}
            getCategorySuggestions={getCategorySuggestions}
            getShortDescriptionFromDescription={
              getShortDescriptionFromDescription
            }
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
            urlRequired={documentType !== 'Lab Material'}
            selectedTeams={(updatedOutput?.teams ?? [team]).map(
              (selectedTeam, index) => ({
                label: selectedTeam.displayName,
                value: selectedTeam.id,
                isFixed: index === 0,
              }),
            )}
            published={published}
            permissions={permissions}
            descriptionUnchangedWarning={descriptionUnchangedWarning}
            onSave={(output) =>
              updatedOutput?.id
                ? updateAndPublishResearchOutput(updatedOutput.id, {
                    ...output,
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
                    published: false,
                    relatedManuscriptVersion:
                      updatedOutput.relatedManuscriptVersion,
                    statusChangedById: updatedOutput.statusChangedBy?.id,
                    isInReview: updatedOutput.isInReview,
                  }).catch(handleError(['/link', '/title'], setErrors))
                : createResearchOutput({
                    ...output,
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

export default TeamOutput;
