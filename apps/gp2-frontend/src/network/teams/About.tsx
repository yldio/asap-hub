import { TeamProfileAbout } from '@asap-hub/react-components';
import { TeamResponse } from '@asap-hub/model';

import { Frame } from '@asap-hub/frontend-utils';

import GroupsCard from './groups/GroupsCard';

interface AboutProps {
  readonly team: TeamResponse;
  readonly teamListElementId: string;
}
const About: React.FC<AboutProps> = ({ team, teamListElementId }) => (
  <TeamProfileAbout
    {...team}
    teamListElementId={teamListElementId}
    teamGroupsCard={
      <Frame title={null} fallback={null}>
        <GroupsCard id={team.id} />
      </Frame>
    }
  />
);

export default About;
