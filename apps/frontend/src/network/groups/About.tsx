import { GroupProfileAbout } from '@asap-hub/react-components';

import { GroupResponse } from '@asap-hub/model';

interface AboutProps {
  group: GroupResponse;
  groupTeamsElementId: string;
}
const About: React.FC<AboutProps> = ({ group, groupTeamsElementId }) => (
  <GroupProfileAbout {...group} membersSectionId={groupTeamsElementId} />
);

export default About;
