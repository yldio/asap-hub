import React, { ComponentProps } from 'react';
import { TeamCreateOutputForm, TeamCreateOutputHeader } from '../organisms';

type TeamCreateOutputPageProps = ComponentProps<typeof TeamCreateOutputHeader> &
  ComponentProps<typeof TeamCreateOutputForm>;

const TeamCreateOutputPage: React.FC<TeamCreateOutputPageProps> = ({
  researchOutput,
  onCreate,
  suggestions,
}) => (
  <>
    <TeamCreateOutputHeader researchOutput={researchOutput} />
    <TeamCreateOutputForm onCreate={onCreate} suggestions={suggestions} />
  </>
);

export default TeamCreateOutputPage;
