import React, { ComponentProps } from 'react';
import { TeamCreateOutputForm, TeamCreateOutputHeader } from '../organisms';

type TeamCreateOutputPageProps = ComponentProps<typeof TeamCreateOutputHeader> &
  ComponentProps<typeof TeamCreateOutputForm>;

const TeamCreateOutputPage: React.FC<TeamCreateOutputPageProps> = ({
  researchOutput,
  onCreate,
}) => (
  <>
    <TeamCreateOutputHeader researchOutput={researchOutput} />
    <TeamCreateOutputForm onCreate={onCreate} />
  </>
);

export default TeamCreateOutputPage;
