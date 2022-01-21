import React from 'react';
import { CreateTeamResearchOutput } from '@asap-hub/model';

import { TeamCreateOutputHeader, TeamCreateOutputForm } from '../organisms';

type TeamCreateOutputPageProps = {
  onCreate: () => void;
  researchOutput: CreateTeamResearchOutput;
};

const TeamCreateOutputPage: React.FC<TeamCreateOutputPageProps> = ({
  researchOutput,
  onCreate,
}) => (
  <>
    <TeamCreateOutputHeader type={researchOutput.type || 'unknown'} />
    <TeamCreateOutputForm onCreate={onCreate} />
  </>
);

export default TeamCreateOutputPage;
