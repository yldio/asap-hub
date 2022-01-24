import { TeamCreateOutputPage } from '@asap-hub/react-components';
import { ResearchOutput } from '@asap-hub/model';
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
    asapFunded: undefined,
    sharingStatus: 'Network Only',
    usedInPublication: undefined,
    addedDate: new Date().toISOString(),
  });

  return (
    <Frame title="create output">
      <TeamCreateOutputPage
        researchOutput={researchOutput}
        onCreate={() => createResearchOutput(researchOutput)}
      />
    </Frame>
  );
};

export default TeamOutput;
