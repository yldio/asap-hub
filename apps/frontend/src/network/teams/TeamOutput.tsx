import React from 'react';
import { ResearchOutputPostRequest, ResearchOutputType } from '@asap-hub/model';
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
} from './state';
import Frame from '../../structure/Frame';
import researchSuggestions from './research-suggestions';

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

  const { isEnabled } = useFlags();

  const createResearchOutput = usePostTeamResearchOutput();

  const defaultOutput: ResearchOutputPostRequest = {
    teamId,
    type,
    link: 'https://hub.asap.science/',
    title: 'Output created through the ROMS form',
    asapFunded: undefined,
    sharingStatus: 'Network Only',
    usedInPublication: undefined,
    description: 'example',
    subTypes: [],
    addedDate: new Date().toISOString(),
    tags: [],
  };

  const getLabSuggestions = useLabSuggestions();
  const getAuthorSuggestions = useAuthorSuggestions();

  const showCreateOutputPage = isEnabled('ROMS_FORM');

  if (showCreateOutputPage) {
    return (
      <Frame title="Share Research Output">
        <TeamCreateOutputPage
          tagSuggestions={researchSuggestions}
          type={type}
          getLabSuggestions={getLabSuggestions}
          getAuthorSuggestions={getAuthorSuggestions}
          onSave={(output) =>
            createResearchOutput({
              ...defaultOutput,
              ...output,
              addedDate: new Date().toISOString(),
            })
          }
        />
      </Frame>
    );
  }
  return <NotFoundPage />;
};

export default TeamOutput;
