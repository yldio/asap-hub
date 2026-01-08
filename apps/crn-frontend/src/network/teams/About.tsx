import {
  TeamProfileAbout,
  ProjectProfileAbout,
} from '@asap-hub/react-components';
import { TeamResponse } from '@asap-hub/model';

import { Frame } from '@asap-hub/frontend-utils';
import { isEnabled } from '@asap-hub/flags';

import InterestGroupsCard from './interest-groups/InterestGroupsCard';

interface AboutProps {
  readonly team: TeamResponse;
  readonly teamListElementId: string;
}
const About: React.FC<AboutProps> = ({ team, teamListElementId }) =>
  !isEnabled('PROJECTS_MVP') ? (
    <ProjectProfileAbout
      {...team}
      teamListElementId={teamListElementId}
      teamGroupsCard={
        <Frame title={null} fallback={null}>
          <InterestGroupsCard id={team.id} isInactive={team.inactiveSince} />
        </Frame>
      }
    />
  ) : (
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
