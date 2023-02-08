import { WorkingGroupAbout } from '@asap-hub/react-components';

import { WorkingGroupResponse } from '@asap-hub/model';

interface AboutProps {
  workingGroup: WorkingGroupResponse;
  membersListElementId: string;
}
const About: React.FC<AboutProps> = ({
  workingGroup,
  membersListElementId,
}) => (
  <WorkingGroupAbout
    {...workingGroup}
    membersListElementId={membersListElementId}
  />
);

export default About;
