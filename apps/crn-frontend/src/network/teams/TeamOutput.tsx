import React, { useState } from 'react';
import {
  ValidationErrorResponse,
  ResearchOutputPostRequest,
  ResearchOutputType,
  isValidationErrorResponse,
} from '@asap-hub/model';
import { useFlags } from '@asap-hub/react-context';
import { TeamCreateOutputPage, NotFoundPage } from '@asap-hub/react-components';

import {
  network,
  useRouteParams,
  OutputTypeParameter,
} from '@asap-hub/routing';
import {
  useLabSuggestions,
  usePostTeamResearchOutput,
  useAuthorSuggestions,
  useTeamById,
  useTeamSuggestions,
} from './state';
import Frame from '../../structure/Frame';
import researchSuggestions from './research-suggestions';
import {
  BackendError,
  clearAjvErrorForPath,
  validationErrorsAreSupported,
} from '../../api-util';

const useParamOutputType = (teamId: string): OutputTypeParameter => {
  const route = network({}).teams({}).team({ teamId }).createOutput;
  const { outputType } = useRouteParams(route);
  return outputType;
};

export function paramOutputTypeToResearchOutputType(
  data: OutputTypeParameter,
): ResearchOutputType {
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
};
const TeamOutput: React.FC<TeamOutputProps> = ({ teamId }) => {
  const paramOutputType = useParamOutputType(teamId);
  const type = paramOutputTypeToResearchOutputType(paramOutputType);
  const team = useTeamById(teamId);
  const [errors, setErrors] = useState<ValidationErrorResponse['data']>([]);
  const { isEnabled } = useFlags();

  const createResearchOutput = usePostTeamResearchOutput();

  const defaultOutput: ResearchOutputPostRequest = {
    type,
    title: 'Output created through the ROMS form',
    asapFunded: undefined,
    sharingStatus: 'Network Only',
    usedInPublication: undefined,
    description: 'example',
    subTypes: [],
    addedDate: new Date().toISOString(),
    tags: [],
    teams: [teamId],
    publishDate: undefined,
  };

  const getLabSuggestions = useLabSuggestions();
  const getAuthorSuggestions = useAuthorSuggestions();

  const getTeamSuggestions = useTeamSuggestions();

  const showCreateOutputPage = isEnabled('ROMS_FORM');

  if (showCreateOutputPage && team) {
    return (
      <Frame title="Share Research Output">
        <TeamCreateOutputPage
          team={team}
          tagSuggestions={researchSuggestions.map((suggestion) => ({
            label: suggestion,
            value: suggestion,
          }))}
          type={type}
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
          serverValidationErrors={errors}
          clearServerValidationError={(instancePath: string) =>
            setErrors(clearAjvErrorForPath(errors, instancePath))
          }
          onSave={(output) =>
            createResearchOutput({
              ...defaultOutput,
              ...output,
              addedDate: new Date().toISOString(),
            }).catch((error) => {
              if (error instanceof BackendError) {
                const { response } = error;
                if (
                  isValidationErrorResponse(response) &&
                  validationErrorsAreSupported(response, ['/link'])
                ) {
                  setErrors(response.data);
                  return;
                }
              }
              throw error;
            })
          }
        />
      </Frame>
    );
  }
  return <NotFoundPage />;
};

export default TeamOutput;
