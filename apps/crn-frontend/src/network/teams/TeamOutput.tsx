import {
  BackendError,
  clearAjvErrorForPath,
  Frame,
  validationErrorsAreSupported,
} from '@asap-hub/frontend-utils';
import {
  isValidationErrorResponse,
  ValidationErrorResponse,
  ResearchOutputResponse,
} from '@asap-hub/model';
import {
  NotFoundPage,
  ResearchOutputTeamForm,
} from '@asap-hub/react-components';
import { ResearchOutputPermissionsContext } from '@asap-hub/react-context';
import {
  network,
  TeamOutputDocumentTypeParameter,
  useRouteParams,
  sharedResearch,
} from '@asap-hub/routing';
import React, { useContext, useState } from 'react';
import researchSuggestions from './research-suggestions';
import {
  ResearchOutputPostRequest,
  ResearchOutputPutRequest,
} from '../../../../../packages/model/src/research-output';
import {
  useAuthorSuggestions,
  useLabSuggestions,
  usePostResearchOutput,
  useResearchTags,
  useTeamById,
  useTeamSuggestions,
  usePutTeamResearchOutput,
} from './state';
import { paramOutputDocumentTypeToResearchOutputDocumentType } from '../../shared-research';

const useParamOutputDocumentType = (
  teamId: string,
): TeamOutputDocumentTypeParameter => {
  const route = network({}).teams({}).team({ teamId }).createOutput;
  const { teamOutputDocumentType } = useRouteParams(route);
  return teamOutputDocumentType;
};

type TeamOutputProps = {
  teamId: string;
  researchOutputData?: ResearchOutputResponse;
};
const TeamOutput: React.FC<TeamOutputProps> = ({
  teamId,
  researchOutputData,
}) => {
  const paramOutputDocumentType = useParamOutputDocumentType(teamId);
  const isEditMode = !!researchOutputData;
  const { researchOutputId } = useRouteParams(
    sharedResearch({}).researchOutput,
  );
  const documentType =
    researchOutputData?.documentType ||
    paramOutputDocumentTypeToResearchOutputDocumentType(
      paramOutputDocumentType,
    );
  const team = useTeamById(teamId);
  const [errors, setErrors] = useState<ValidationErrorResponse['data']>([]);

  const { canCreateUpdate } = useContext(ResearchOutputPermissionsContext);

  const createResearchOutput = usePostResearchOutput();
  const updateResearchOutput = usePutTeamResearchOutput(researchOutputId);

  const getLabSuggestions = useLabSuggestions();
  const getAuthorSuggestions = useAuthorSuggestions();
  const getTeamSuggestions = useTeamSuggestions();
  const researchTags = useResearchTags();

  const handleError = (error: unknown) => {
    if (error instanceof BackendError) {
      const { response } = error;
      if (
        isValidationErrorResponse(response) &&
        validationErrorsAreSupported(response, ['/link', '/title'])
      ) {
        setErrors(response.data);
        return;
      }
    }
    throw error;
  };

  if (canCreateUpdate && team) {
    return (
      <Frame title="Share Research Output">
        <ResearchOutputTeamForm
          team={team}
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
          isEditMode={isEditMode}
          publishingEntity="Team"
          onSave={(
            output: ResearchOutputPostRequest | ResearchOutputPutRequest,
          ) =>
            isEditMode
              ? updateResearchOutput(output).catch(handleError)
              : createResearchOutput(output).catch(handleError)
          }
        />
      </Frame>
    );
  }
  return <NotFoundPage />;
};

export default TeamOutput;
