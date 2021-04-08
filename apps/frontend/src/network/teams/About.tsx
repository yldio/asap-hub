import React from 'react';
import { TeamProfileAbout } from '@asap-hub/react-components';
import { TeamResponse } from '@asap-hub/model';

import Frame from '../../structure/Frame';
import GroupsCard from './groups/GroupsCard';

interface AboutProps {
  readonly team: TeamResponse;
}
const About: React.FC<AboutProps> = ({ team }) => (
  <TeamProfileAbout
    {...team}
    members={team.members}
    teamGroupsCard={
      <Frame title={null} fallback={null}>
        <GroupsCard id={team.id} />
      </Frame>
    }
  />
);

export default About;
