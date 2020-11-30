import React from 'react';
import { join } from 'path';
import { TeamProfileAbout } from '@asap-hub/react-components';
import { TeamResponse } from '@asap-hub/model';

import { SHARED_RESEARCH_PATH } from '../../routes';

interface AboutProps {
  readonly team: TeamResponse;
}
const About: React.FC<AboutProps> = ({ team }) => {
  return (
    <TeamProfileAbout
      {...team}
      proposalHref={
        team.proposalURL && join(SHARED_RESEARCH_PATH, team.proposalURL)
      }
    />
  );
};

export default About;
