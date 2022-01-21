import React from 'react';
import { ResearchOutput } from '@asap-hub/model';

import { TeamCreateOutputHeader, TeamCreateOutputForm } from '../organisms';

type TeamCreateOutputPageProps = {
  onCreate: () => void;
  researchOutput: ResearchOutput;
};

const TeamCreateOutputPage: React.FC<TeamCreateOutputPageProps> = ({
  researchOutput,
  onCreate,
}) => (
  <>
    <TeamCreateOutputHeader type={researchOutput.type} />
    <TeamCreateOutputForm onCreate={onCreate} />
  </>
);

export default TeamCreateOutputPage;
