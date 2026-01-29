import { TeamProfileAbout } from '@asap-hub/react-components';
import { TeamResponse } from '@asap-hub/model';

import { Frame } from '@asap-hub/frontend-utils';

import InterestGroupsCard from './interest-groups/InterestGroupsCard';

interface AboutProps {
  readonly team: TeamResponse;
  readonly teamListElementId: string;
  readonly isAsapTeam: boolean;
}
const About: React.FC<AboutProps> = ({
  isAsapTeam,
  team,
  teamListElementId,
}) => (
  <TeamProfileAbout
    {...team}
    isAsapTeam={isAsapTeam}
    teamListElementId={teamListElementId}
    teamGroupsCard={
      <Frame title={null} fallback={null}>
        <InterestGroupsCard id={team.id} isInactive={team.inactiveSince} />
      </Frame>
    }
  />
);

export default About;
