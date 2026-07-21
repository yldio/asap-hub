import { clearAjvErrorForPath } from '@asap-hub/frontend-utils';
import {
  ManuscriptVersionResponse,
  researchOutputDocumentTypeToType,
  ResearchOutputResponse,
  ResearchOutputVersion,
  ValidationErrorResponse,
} from '@asap-hub/model';
import {
  Loading,
  ManuscriptVersionImportCard,
  NotFoundPage,
  OutputVersions,
  ResearchOutputForm,
  Toast,
  usePrevious,
} from '@asap-hub/react-components';
import { resolveResearchOutputAvailableActions } from '@asap-hub/react-context';
import {
  network,
  OutputDocumentTypeParameter,
  useRouteParams,
} from '@asap-hub/routing';
import React, { useEffect, useMemo, useState } from 'react';
import {
  ManuscriptImport,
  resolveManuscriptImportContext,
  resolveResearchOutput,
} from '../shared-research/manuscript-import';
import ManuscriptOutputSelectionScreen from '../shared-research/ManuscriptOutputSelectionScreen';
import OutputPageShell from '../shared-research/OutputPageShell';
import { useResearchOutputPermissions } from '../shared-research/state';
import { resolveResearchOutputFlowId } from '../shared-research/util';
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
} from '../shared-state';
import { useTeamById } from '../network/teams/state';

const useParamOutputDocumentType = (
  teamId: string,
): OutputDocumentTypeParameter => {
  const route = network({}).teams({}).team({ teamId }).createOutput;
  const { outputDocumentType } = useRouteParams(route);
  return outputDocumentType;
};

const toResearchOutputVersion = (
  output?: ResearchOutputResponse,
): ResearchOutputVersion => ({
  id: output?.id ?? '',
  title: output?.title ?? '',
  documentType: output?.documentType ?? 'Article',
  type: output?.type,
  link: output?.link,
  addedDate: output?.addedDate,
});

type ProjectOutputProps = {
  teamId: string;
  existingOutput?: ResearchOutputResponse;
  latestManuscriptVersion?: ManuscriptVersionResponse;
  versionAction?: 'create' | 'edit';
  isDuplicate?: boolean;
};

const ProjectOutput: React.FC<ProjectOutputProps> = ({
  teamId,
  existingOutput,
  latestManuscriptVersion,
  versionAction: versionActionProp,
  isDuplicate = false,
}) => {
  const [manuscriptImport, setManuscriptImport] = useState<ManuscriptImport>();
  const [errors, setErrors] = useState<ValidationErrorResponse['data']>([]);
  const previousErrors = usePrevious(errors);

  // turns the create flow into adding a version of it.
  const versionAction =
    manuscriptImport?.kind === 'add-version-from-manuscript'
      ? 'create'
      : versionActionProp;

  const researchOutput = useMemo(
    () =>
      resolveResearchOutput({
        existingOutput,
        manuscriptImport,
        latestManuscriptVersion,
        versionAction: versionActionProp,
        publishingEntity: 'Team',
      }),
    [
      existingOutput,
      manuscriptImport,
      latestManuscriptVersion,
      versionActionProp,
    ],
  );

  const paramOutputDocumentType = useParamOutputDocumentType(teamId);
  const documentType =
    researchOutput?.documentType ||
    paramOutputDocumentTypeToResearchOutputDocumentType(
      paramOutputDocumentType,
    );
  const team = useTeamById(teamId);

  useEffect(() => {
    if (previousErrors && previousErrors.length < errors.length) {
      window.scrollTo(0, 0);
    }
  }, [errors, previousErrors]);

  const createResearchOutput = usePostResearchOutput();
  const updateResearchOutput = usePutResearchOutput();
  const updateAndPublishResearchOutput = usePutResearchOutput(true);

  const getImpactSuggestions = useImpactSuggestions();
  const getCategorySuggestions = useCategorySuggestions();
  const getShortDescriptionFromDescription = useGeneratedContent();
  const getLabSuggestions = useLabSuggestions();
  const getAuthorSuggestions = useAuthorSuggestions();
  const getTeamSuggestions = useTeamSuggestions();
  const getRelatedResearchSuggestions = useRelatedResearchSuggestions(
    researchOutput?.id,
  );
  const getRelatedEventSuggestions = useRelatedEventsSuggestions();
  const researchTags = useResearchTags();

  const published = !!researchOutput?.published;

  const {
    isNewManuscriptVersion,
    importedManuscriptVersion,
    isImportedFromManuscript,
  } = resolveManuscriptImportContext({
    existingOutput,
    manuscriptImport,
    latestManuscriptVersion,
    versionAction: versionActionProp,
    researchOutput,
  });

  const permissions = useResearchOutputPermissions(
    'teams',
    researchOutput?.teams.map(({ id }) => id) ?? [teamId],
    published,
    isImportedFromManuscript,
  );
  const flowId = resolveResearchOutputFlowId({
    entityType: 'team',
    versionAction,
    published,
    isImportedFromManuscript,
    isDuplicate,
    // the auto-created preprint gains an id at runtime, turning the import
    // flow into add-version
    hasResearchOutputId: !!researchOutput?.id,
  });

  const researchSuggestions = researchTags
    .filter((tag) => tag.category === 'Keyword')
    .map((keyword) => keyword.name);

  let versions: ResearchOutputVersion[];
  if (versionAction === 'edit') {
    versions = researchOutput?.versions ?? [];
  } else if (isNewManuscriptVersion) {
    versions = [
      ...(existingOutput?.versions ?? []),
      toResearchOutputVersion(existingOutput),
    ];
  } else {
    versions = [
      ...(researchOutput?.versions ?? []),
      toResearchOutputVersion(researchOutput),
    ];
  }

  const availableActions = resolveResearchOutputAvailableActions({
    flowId,
    permissions,
    researchOutputData: researchOutput,
    documentType,
    versions,
    isImportedFromManuscript,
  });

  const [showManuscriptOutputFlow, setShowManuscriptOutputFlow] = useState(
    () =>
      !isNewManuscriptVersion &&
      !isDuplicate &&
      documentType === 'Article' &&
      !existingOutput?.id,
  );

  if (!team) {
    return <NotFoundPage />;
  }

  // The routes that mount this flow gate on the version being loaded; kept
  // as a safety net for un-gated mounts.
  if (isNewManuscriptVersion && !latestManuscriptVersion) {
    return <Loading />;
  }

  if (showManuscriptOutputFlow) {
    return (
      <OutputPageShell documentType={documentType}>
        <ManuscriptOutputSelectionScreen
          teamId={teamId}
          onCreateManually={() => setShowManuscriptOutputFlow(false)}
          onManuscriptImported={(imported) => {
            setManuscriptImport(imported);
            setShowManuscriptOutputFlow(false);
          }}
        />
      </OutputPageShell>
    );
  }

  return (
    <OutputPageShell
      documentType={documentType}
      banner={
        versionAction === 'create' && (
          <Toast accent="warning">
            The previous output page will be replaced with a summarised version
            history section.
          </Toast>
        )
      }
    >
      {availableActions.showVersionHistory && (
        <OutputVersions app="crn" versions={versions} formLayout />
      )}
      {importedManuscriptVersion && (
        <ManuscriptVersionImportCard version={importedManuscriptVersion} />
      )}
      <ResearchOutputForm
        tagSuggestions={researchSuggestions}
        documentType={documentType}
        getLabSuggestions={getLabSuggestions}
        getImpactSuggestions={getImpactSuggestions}
        getCategorySuggestions={getCategorySuggestions}
        getShortDescriptionFromDescription={getShortDescriptionFromDescription}
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
        researchOutputData={researchOutput}
        typeOptions={Array.from(researchOutputDocumentTypeToType[documentType])}
        urlRequired={documentType !== 'Lab Material'}
        selectedTeams={(researchOutput?.teams ?? [team]).map(
          (selectedTeam, index) => ({
            label: selectedTeam.displayName,
            value: selectedTeam.id,
            isFixed: index === 0,
          }),
        )}
        published={published}
        permissions={permissions}
        isImportedFromManuscript={isImportedFromManuscript}
        onSave={(output) =>
          researchOutput?.id
            ? updateAndPublishResearchOutput(researchOutput.id, {
                ...output,
                published: true,
                createVersion: versionAction === 'create',
                relatedManuscriptVersion:
                  versionAction === 'create'
                    ? importedManuscriptVersion?.versionId
                    : researchOutput.relatedManuscriptVersion,
                statusChangedById: researchOutput.statusChangedBy?.id,
                isInReview: researchOutput.isInReview,
              }).catch(handleError(['/link', '/title'], setErrors))
            : createResearchOutput({
                ...output,
                published: true,
                relatedManuscriptVersion:
                  researchOutput?.relatedManuscriptVersion,
                relatedManuscript: researchOutput?.relatedManuscript,
              }).catch(handleError(['/link', '/title'], setErrors))
        }
        onSaveDraft={(output) =>
          researchOutput?.id
            ? updateResearchOutput(researchOutput.id, {
                ...output,
                published: false,
                statusChangedById: researchOutput.statusChangedBy?.id,
                isInReview: researchOutput.isInReview,
              }).catch(handleError(['/link', '/title'], setErrors))
            : createResearchOutput({
                ...output,
                published: false,
              }).catch(handleError(['/link', '/title'], setErrors))
        }
        flowId={flowId}
        availableActions={availableActions}
      />
    </OutputPageShell>
  );
};

export default ProjectOutput;
