import { NotFoundPage, TeamCreateOutputPage } from '@asap-hub/react-components';
import { ResearchOutput } from '@asap-hub/model';
import { useFlags } from '@asap-hub/react-context';
import React, { useState } from 'react';

import {
  network,
  useRouteParams,
  OutputTypeParameter,
} from '@asap-hub/routing';
import { usePostTeamResearchOutput } from './state';
import Frame from '../../structure/Frame';
import researchSuggestions from './research-suggestions';

const useParamOutputType = (teamId: string): OutputTypeParameter => {
  const route = network({}).teams({}).team({ teamId }).createOutput;
  const { outputType } = useRouteParams(route);
  return outputType;
};

export function paramOutputTypeToResearchOutputType(
  data: OutputTypeParameter,
): ResearchOutput['type'] {
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
  const outputType = paramOutputTypeToResearchOutputType(paramOutputType);

  const { isEnabled } = useFlags();
  const createResearchOutput = usePostTeamResearchOutput(teamId);
  const [researchOutput] = useState<ResearchOutput>({
    type: outputType,
    link: 'https://hub.asap.science/',
    title: 'Output created through the ROMS form',
    asapFunded: undefined,
    sharingStatus: 'Network Only',
    usedInPublication: undefined,
    addedDate: new Date().toISOString(),
  });

  const showCreateOutputPage = isEnabled('ROMS_FORM');

  if (showCreateOutputPage) {
    return (
      <Frame title="create output">
        <TeamCreateOutputPage
          suggestions={researchSuggestions}
          researchOutput={researchOutput}
          onCreate={() => createResearchOutput(researchOutput)}
        />
      </Frame>
    );
  }
  return <NotFoundPage />;
};

export default TeamOutput;
