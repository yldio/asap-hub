import { NotFoundPage, TeamCreateOutputPage } from '@asap-hub/react-components';
import {
  ResearchOutput,
  ResearchOutputType,
  researchOutputTypes,
} from '@asap-hub/model';
import React, { useState } from 'react';

import { usePostTeamResearchOutput } from './state';
import Frame from '../../structure/Frame';

type TeamOutputProps = {
  teamId: string;
};
const TeamOutput: React.FC<TeamOutputProps> = ({ teamId }) => {
  const createResearchOutput = usePostTeamResearchOutput(teamId);
  const [researchOutput] = useState<ResearchOutput>({
    type: 'Bioinformatics',
    link: 'https://hub.asap.science/',
    title: 'Output created through the ROMS form',
    asapFunded: false,
    sharingStatus: 'Network Only',
    usedInPublication: false,
    addedDate: new Date().toISOString(),
  });

  if (isResearchOutputType('Bioinformatics')) {
    return (
      <Frame title="create output">
        <TeamCreateOutputPage
          researchOutput={researchOutput}
          onCreate={() => createResearchOutput(researchOutput)}
        />
      </Frame>
    );
  }
  return <NotFoundPage />;
};

export default TeamOutput;

const isResearchOutputType = (type: string): type is ResearchOutputType =>
  (researchOutputTypes as ReadonlyArray<string>)
    .map((s) => s.toLowerCase())
    .includes(type.toLowerCase());
