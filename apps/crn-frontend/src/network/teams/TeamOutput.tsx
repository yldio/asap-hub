import { clearAjvErrorForPath, Frame } from '@asap-hub/frontend-utils';
import {
  ValidationErrorResponse,
  ResearchOutputResponse,
  researchOutputDocumentTypeToType,
} from '@asap-hub/model';
import {
  NotFoundPage,
  ResearchOutputForm,
  ResearchOutputHeader,
} from '@asap-hub/react-components';
import { ResearchOutputPermissionsContext } from '@asap-hub/react-context';
import {
  network,
  TeamOutputDocumentTypeParameter,
  useRouteParams,
} from '@asap-hub/routing';
import React, { useContext, useState } from 'react';
import researchSuggestions from './research-suggestions';
import { useTeamById } from './state';
import {
  handleError,
  paramOutputDocumentTypeToResearchOutputDocumentType,
  useAuthorSuggestions,
  useLabSuggestions,
  useTeamSuggestions,
  useResearchTags,
  usePutResearchOutput,
  usePostResearchOutput,
  useRelatedResearchSuggestions,
} from '../../shared-research';

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
  const documentType =
    researchOutputData?.documentType ||
    paramOutputDocumentTypeToResearchOutputDocumentType(
      paramOutputDocumentType,
    );
  const team = useTeamById(teamId);
  const [errors, setErrors] = useState<ValidationErrorResponse['data']>([]);

  const { canCreateUpdate } = useContext(ResearchOutputPermissionsContext);

  const createResearchOutput = usePostResearchOutput();
  const updateResearchOutput = usePutResearchOutput();

  const getLabSuggestions = useLabSuggestions();
  const getAuthorSuggestions = useAuthorSuggestions();
  const getTeamSuggestions = useTeamSuggestions();
  const getRelatedResearchSuggestions = useRelatedResearchSuggestions();
  const researchTags = useResearchTags();

  if (canCreateUpdate && team) {
    return (
      <Frame title="Share Research Output">
        <ResearchOutputHeader
          documentType={documentType}
          workingGroupAssociation={false}
        />
        <ResearchOutputForm
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
          getRelatedResearchSuggestions={getRelatedResearchSuggestions}
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
          onSave={(output) =>
            researchOutputData
              ? updateResearchOutput(researchOutputData.id, output).catch(
                  handleError(['/link', '/title'], setErrors),
                )
              : createResearchOutput(output).catch(
                  handleError(['/link', '/title'], setErrors),
                )
          }
        />
      </Frame>
    );
  }
  return <NotFoundPage />;
};

export default TeamOutput;
