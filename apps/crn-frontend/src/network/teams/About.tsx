import { TeamProfileAbout } from '@asap-hub/react-components';
import { TeamResponse } from '@asap-hub/model';

import { Frame } from '@asap-hub/frontend-utils';

import InterestGroupsCard from './interest-groups/InterestGroupsCard';

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
        <InterestGroupsCard id={team.id} isInactive={team.inactiveSince} />
      </Frame>
    }
  />
);

export default About;
