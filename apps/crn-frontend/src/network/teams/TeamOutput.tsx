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
import { useTeamById } from './state';
import {
  handleError,
  paramOutputDocumentTypeToResearchOutputDocumentType,
  useAuthorSuggestions,
  useLabSuggestions,
  usePostResearchOutput,
  usePutResearchOutput,
  useRelatedEventsSuggestions,
  useRelatedResearchSuggestions,
  useResearchTags,
  useTeamSuggestions,
} from '../../shared-research';
import { useResearchOutputPermissions } from '../../shared-research/state';

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
  const paramOutputDocumentType = useParamOutputDocumentType(teamId);
  const documentType =
    researchOutputData?.documentType ||
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
  const getRelatedResearchSuggestions = useRelatedResearchSuggestions(
    researchOutputData?.id,
  );
  const getRelatedEventSuggestions = useRelatedEventsSuggestions();
  const researchTags = useResearchTags();

  const published = researchOutputData ? !!researchOutputData.published : false;

  const permissions = useResearchOutputPermissions(
    'teams',
    researchOutputData?.teams.map(({ id }) => id) ?? [teamId],
    published,
  );
  const researchSuggestions = researchTags
    .filter((tag) => tag.category === 'Keyword')
    .map((keyword) => keyword.name);

  const researchOutputAsVersion: ResearchOutputVersion = {
    id: researchOutputData?.id ?? '',
    title: researchOutputData?.title ?? '',
    documentType: researchOutputData?.documentType ?? 'Article',
    type: researchOutputData?.type,
    link: researchOutputData?.link,
    addedDate: researchOutputData?.addedDate,
  };

  let versions: ResearchOutputVersion[] = researchOutputData?.versions
    ? researchOutputData.versions.concat([researchOutputAsVersion])
    : [researchOutputAsVersion];

  if (versionAction === 'edit') {
    versions = researchOutputData?.versions ?? [];
  }

  if (team) {
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
          {versionAction && (
            <OutputVersions versions={versions} versionAction={versionAction} />
          )}
          <ResearchOutputForm
            versionAction={versionAction}
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
            urlRequired={documentType !== 'Lab Resource'}
            selectedTeams={(researchOutputData?.teams ?? [team]).map(
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
              researchOutputData?.id
                ? updateAndPublishResearchOutput(researchOutputData.id, {
                    ...output,
                    published: true,
                    createVersion: versionAction === 'create',
                    statusChangedById: researchOutputData.statusChangedBy?.id,
                    isInReview: researchOutputData.isInReview,
                  }).catch(handleError(['/link', '/title'], setErrors))
                : createResearchOutput({ ...output, published: true }).catch(
                    handleError(['/link', '/title'], setErrors),
                  )
            }
            onSaveDraft={(output) =>
              researchOutputData?.id
                ? updateResearchOutput(researchOutputData.id, {
                    ...output,
                    published: false,
                    statusChangedById: researchOutputData.statusChangedBy?.id,
                    isInReview: researchOutputData.isInReview,
                  }).catch(handleError(['/link', '/title'], setErrors))
                : createResearchOutput({
                    ...output,
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

export default TeamOutput;
