import {
  BackendError,
  clearAjvErrorForPath,
  Frame,
  validationErrorsAreSupported,
} from '@asap-hub/frontend-utils';
import {
  isValidationErrorResponse,
  ResearchOutputDocumentType,
  ValidationErrorResponse,
  ResearchOutputResponse,
} from '@asap-hub/model';
import { NotFoundPage, ResearchOutputPage } from '@asap-hub/react-components';
import { ResearchOutputPermissionsContext } from '@asap-hub/react-context';
import {
  network,
  OutputDocumentTypeParameter,
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
  usePostTeamResearchOutput,
  useResearchTags,
  useTeamById,
  useTeamSuggestions,
  usePutTeamResearchOutput,
} from './state';

const useParamOutputDocumentType = (
  teamId: string,
): OutputDocumentTypeParameter => {
  const route = network({}).teams({}).team({ teamId }).createOutput;
  const { outputDocumentType } = useRouteParams(route);
  return outputDocumentType;
};

export function paramOutputDocumentTypeToResearchOutputDocumentType(
  data: OutputDocumentTypeParameter,
): ResearchOutputDocumentType {
  switch (data) {
    case 'article':
      return 'Article';
    case 'bioinformatics':
      return 'Bioinformatics';
    case 'dataset':
      return 'Dataset';
    case 'lab-resource':
      return 'Lab Resource';
    case 'protocol':
      return 'Protocol';
    default:
      return 'Article';
  }
}

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

  const createResearchOutput = usePostTeamResearchOutput();
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
        <ResearchOutputPage
          team={team}
          tagSuggestions={researchSuggestions.map((suggestion) => ({
            label: suggestion,
            value: suggestion,
          }))}
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
