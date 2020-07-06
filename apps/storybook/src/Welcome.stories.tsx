import React from 'react';
import { text } from '@storybook/addon-knobs';
import { Messages } from '@asap-hub/react-components';

export default { title: 'Templates / Email' };

export const Welcome = () => (
  <Messages.Welcome
    firstName={text('First Name', 'Filipe')}
    link={'https://hub.asap.science'}
  />
);
