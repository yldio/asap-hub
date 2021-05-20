import { ComponentProps } from 'react';
import { PersonalInfoModal } from '@asap-hub/react-components';
import { StaticRouter } from 'react-router-dom';

export default {
  title: 'Templates / User Profile / Personal Info Modal',
  component: PersonalInfoModal,
};

const props = (): ComponentProps<typeof PersonalInfoModal> => ({
  firstName: 'John',
  lastName: 'Doe',
  degree: 'PhD',
  jobTitle: 'Assistant Professor',
  location: 'Los Angeles, CA',
  backHref: '#',
});

export const Normal = () => (
  <StaticRouter>
    <PersonalInfoModal {...props()} backHref="/wrong" />
  </StaticRouter>
);
