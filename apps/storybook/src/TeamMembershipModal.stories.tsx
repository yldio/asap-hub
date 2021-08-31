import { createLabs } from '@asap-hub/fixtures';
import { TeamMembershipModal } from '@asap-hub/react-components';
import { number } from '@storybook/addon-knobs';
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
      labs={createLabs({ labs: number('labs', 2, { min: 0 }) })}
    />
  </StaticRouter>
);
