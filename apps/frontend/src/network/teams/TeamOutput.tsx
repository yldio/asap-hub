import { NotFoundPage, TeamCreateOutputPage } from '@asap-hub/react-components';
import { ResearchOutput } from '@asap-hub/model';
import { useFlags } from '@asap-hub/react-context';
import React, { useState } from 'react';

import { usePostTeamResearchOutput } from './state';
import Frame from '../../structure/Frame';

type TeamOutputProps = {
  teamId: string;
};
const TeamOutput: React.FC<TeamOutputProps> = ({ teamId }) => {
  const { isEnabled } = useFlags();
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

  const showCreateOutputPage = isEnabled('ROMS_FORM');

  if (showCreateOutputPage) {
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
