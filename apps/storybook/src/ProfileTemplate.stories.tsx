import React from 'react';

import { button, date, text } from '@storybook/addon-knobs';
import { Profile } from '@asap-hub/react-components';

export default { title: 'Templates / Profile' };

export const Normal = () => (
  <Profile
    department={text('Department', 'Biology Department')}
    displayName={text('Display Name', 'Phillip Mars, PhD')}
    institution={text('Institution', 'Yale University')}
    lastModified={date('lastModified', new Date())}
    location={text('Location', 'New Haven, Connecticut')}
    role={text('Role', 'Researcher')}
    team={text('Team', 'Team A')}
    title={text('Title', 'Assistant Professor')}
  />
);
