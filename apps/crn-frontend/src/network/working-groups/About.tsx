import { WorkingGroupAbout } from '@asap-hub/react-components';

import { WorkingGroupResponse } from '@asap-hub/model';

interface AboutProps {
  showCollaborationCard: boolean;
  workingGroup: WorkingGroupResponse;
  membersListElementId: string;
}
const About: React.FC<AboutProps> = ({
  showCollaborationCard,
  workingGroup,
  membersListElementId,
}) => (
  <WorkingGroupAbout
    {...workingGroup}
    showCollaborationCard={showCollaborationCard}
    membersListElementId={membersListElementId}
  />
);

export default About;
