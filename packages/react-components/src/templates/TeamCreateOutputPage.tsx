import React from 'react';
import { CreateTeamResearchOutput } from '@asap-hub/model';

import { TeamCreateOutputHeader } from '../organisms';
import { Button } from '../atoms';

type TeamCreateOutputPageProps = {
  onCreate: () => void;
  researchOutput: CreateTeamResearchOutput;
};

const TeamCreateOutputForm: React.FC<{ onCreate: () => void }> = ({
  onCreate,
}) => <Button onClick={onCreate}>Back</Button>;

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
