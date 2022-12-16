import {
  BackendError,
  clearAjvErrorForPath,
  Frame,
  validationErrorsAreSupported,
} from '@asap-hub/frontend-utils';
import {
  ResearchOutputResponse,
  ResearchOutputPublishingEntities,
  isValidationErrorResponse,
  ValidationErrorResponse,
} from '@asap-hub/model';
import { NotFoundPage, ResearchOutputPage } from '@asap-hub/react-components';
import React, { useContext, useState } from 'react';
import { ResearchOutputPermissionsContext } from '@asap-hub/react-context';
import researchSuggestions from '../teams/research-suggestions';
import {
  useAuthorSuggestions,
  useLabSuggestions,
  useWorkingGroupById,
  useTeamSuggestions,
  usePostWorkingGroupResearchOutput,
} from './state';
import { useResearchTags } from '../teams/state';

type WorkingGroupOutputProps = {
  workingGroupId: string;
  researchOutputData?: ResearchOutputResponse;
};
const WorkingGroupOutput: React.FC<WorkingGroupOutputProps> = ({
  workingGroupId,
  researchOutputData,
}) => {
  const [errors, setErrors] = useState<ValidationErrorResponse['data']>([]);

  const documentType = 'Article';
  const workingGroup = useWorkingGroupById(workingGroupId);
  const { canCreateUpdate } = useContext(ResearchOutputPermissionsContext);

  const getLabSuggestions = useLabSuggestions();
  const getAuthorSuggestions = useAuthorSuggestions();
  const getTeamSuggestions = useTeamSuggestions();
  const researchTags = useResearchTags();
  const publishingEntity: ResearchOutputPublishingEntities = 'Working Group';
  const createResearchOutput = usePostWorkingGroupResearchOutput();

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
        <ResearchOutputPage
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
          researchOutputData={researchOutputData}
          serverValidationErrors={errors}
          clearServerValidationError={(instancePath: string) =>
            setErrors(clearAjvErrorForPath(errors, instancePath))
          }
          isEditMode={false}
          publishingEntity={publishingEntity}
          onSave={(output) => createResearchOutput(output).catch(handleError)}
        />
      </Frame>
    );
  }
  return <NotFoundPage />;
};

export default WorkingGroupOutput;
