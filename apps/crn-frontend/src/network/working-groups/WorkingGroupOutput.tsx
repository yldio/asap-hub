import {
  BackendError,
  clearAjvErrorForPath,
  Frame,
  validationErrorsAreSupported,
} from '@asap-hub/frontend-utils';
import {
  ResearchOutputResponse,
  isValidationErrorResponse,
  ValidationErrorResponse,
} from '@asap-hub/model';
import {
  NotFoundPage,
  ResearchOutputTeamForm,
} from '@asap-hub/react-components';
import React, { useContext, useState } from 'react';
import { ResearchOutputPermissionsContext } from '@asap-hub/react-context';
import researchSuggestions from '../teams/research-suggestions';
import {
  useAuthorSuggestions,
  useLabSuggestions,
  useWorkingGroupById,
  useTeamSuggestions,
} from './state';
import { usePostResearchOutput, useResearchTags } from '../teams/state';

type WorkingGroupOutputProps = {
  workingGroupId: string;
  researchOutputData?: ResearchOutputResponse;
};
const WorkingGroupOutput: React.FC<WorkingGroupOutputProps> = ({
  workingGroupId,
  researchOutputData,
}) => {
  const [errors, setErrors] = useState<ValidationErrorResponse['data']>([]);

  const workingGroup = useWorkingGroupById(workingGroupId);
  const { canCreateUpdate } = useContext(ResearchOutputPermissionsContext);

  const getLabSuggestions = useLabSuggestions();
  const getAuthorSuggestions = useAuthorSuggestions();
  const getTeamSuggestions = useTeamSuggestions();
  const researchTags = useResearchTags();
  const createResearchOutput = usePostResearchOutput();

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

  if (canCreateUpdate && workingGroup) {
    return (
      <Frame title="Share Working Group Research Output">
        <ResearchOutputTeamForm
          tagSuggestions={researchSuggestions}
          documentType="Article"
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
          researchOutputData={researchOutputData}
          serverValidationErrors={errors}
          clearServerValidationError={(instancePath: string) =>
            setErrors(clearAjvErrorForPath(errors, instancePath))
          }
          isEditMode={false}
          publishingEntity="Working Group"
          onSave={(output) => createResearchOutput(output).catch(handleError)}
        />
      </Frame>
    );
  }
  return <NotFoundPage />;
};

export default WorkingGroupOutput;
