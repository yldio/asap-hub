import { TeamMembershipModal } from '@asap-hub/react-components';
import { StaticRouter } from 'react-router-dom';

export default {
  title: 'Templates / User Profile / Team Membership Modal',
  component: TeamMembershipModal,
};

export const Normal = () => (
  <StaticRouter>
    <TeamMembershipModal
      id="42"
      role="Key Personnel"
      backHref="#"
      displayName="Team Johnny"
    />
  </StaticRouter>
);
