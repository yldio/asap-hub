import React from 'react';
import { join } from 'path';
import { TeamProfileAbout } from '@asap-hub/react-components';
import { TeamResponse } from '@asap-hub/model';

import { SHARED_RESEARCH_PATH, NETWORK_PATH } from '../../routes';
import { USERS_PATH } from '../routes';

interface AboutProps {
  readonly team: TeamResponse;
}
const About: React.FC<AboutProps> = ({ team }) => (
  <TeamProfileAbout
    {...team}
    members={team.members.map((member) => ({
      ...member,
      href: join(NETWORK_PATH, USERS_PATH, member.id),
    }))}
    proposalHref={
      team.proposalURL && join(SHARED_RESEARCH_PATH, team.proposalURL)
    }
  />
);

export default About;
