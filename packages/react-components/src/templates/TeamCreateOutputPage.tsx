import React, { ComponentProps } from 'react';

import { TeamCreateOutputHeader, TeamCreateOutputForm } from '../organisms';

type TeamCreateOutputPageProps = ComponentProps<typeof TeamCreateOutputHeader> &
  ComponentProps<typeof TeamCreateOutputForm> &
  ComponentProps<typeof TeamCreateOutputHeader>;

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
