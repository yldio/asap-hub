import {
  isValidationErrorResponse,
  ResearchOutputDocumentType,
  ValidationErrorResponse,
} from '@asap-hub/model';
import { NotFoundPage, TeamCreateOutputPage } from '@asap-hub/react-components';
import { useFlags } from '@asap-hub/react-context';
import {
  network,
  OutputDocumentTypeParameter,
  useRouteParams,
} from '@asap-hub/routing';
import {
  BackendError,
  clearAjvErrorForPath,
  validationErrorsAreSupported,
} from '@asap-hub/api-util';
import { Frame } from '@asap-hub/structure';
import {
  useAuthorSuggestions,
  useLabSuggestions,
  usePostTeamResearchOutput,
  useTeamById,
  useTeamSuggestions,
} from './state';

import researchSuggestions from './research-suggestions';

): OutputDocumentTypeParameter => {
  const route = network({}).teams({}).team({ teamId }).createOutput;
  const { outputDocumentType } = useRouteParams(route);
  return outputDocumentType;
};

export function paramOutputDocumentTypeToResearchOutputDocumentType(
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
};
const TeamOutput: React.FC<TeamOutputProps> = ({ teamId }) => {
  const paramOutputDocumentType = useParamOutputDocumentType(teamId);
  const documentType = paramOutputDocumentTypeToResearchOutputDocumentType(
    paramOutputDocumentType,
  );
  const team = useTeamById(teamId);
  const [errors, setErrors] = useState<ValidationErrorResponse['data']>([]);
  const { isEnabled } = useFlags();

  const createResearchOutput = usePostTeamResearchOutput();

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
          serverValidationErrors={errors}
          clearServerValidationError={(instancePath: string) =>
            setErrors(clearAjvErrorForPath(errors, instancePath))
          }
          onSave={(output) =>
            createResearchOutput(output).catch((error: unknown) => {
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
            })
          }
        />
      </Frame>
    );
  }
  return <NotFoundPage />;
};

export default TeamOutput;
