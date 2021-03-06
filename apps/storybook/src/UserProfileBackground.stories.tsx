import { text } from '@storybook/addon-knobs';
import { UserProfileBackground } from '@asap-hub/react-components';
import { TeamRole } from '@asap-hub/model';
import { withDesign } from 'storybook-addon-designs';

import { UserProfileDecorator } from './user-profile';

export default {
  title: 'Organisms / User Profile / Background',
  decorators: [UserProfileDecorator, withDesign],
};

export const Normal = () => (
  <UserProfileBackground
    id="42"
    displayName={text('Display Name', 'John Doe')}
    firstName={text('First Name', 'John')}
    role={text('Role', 'Researcher') as TeamRole}
    approach={text('Approach', '')}
    responsibilities={text('Responsibilities', '')}
  />
);

Normal.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/qM73Om8hMDi8o15nj09ECw/Handover?node-id=6661%3A1024',
  },
};
