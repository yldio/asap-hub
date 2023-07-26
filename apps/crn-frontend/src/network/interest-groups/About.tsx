import { InterestGroupProfileAbout } from '@asap-hub/react-components';

import { InterestGroupResponse } from '@asap-hub/model';

interface AboutProps {
  interestGroup: InterestGroupResponse;
  interestGroupTeamsElementId: string;
}
const About: React.FC<AboutProps> = ({
  interestGroup,
  interestGroupTeamsElementId,
}) => (
  <InterestGroupProfileAbout
    {...interestGroup}
    membersSectionId={interestGroupTeamsElementId}
  />
);

export default About;
