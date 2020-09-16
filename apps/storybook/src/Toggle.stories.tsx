import React from 'react';
import { boolean } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import { Toggle, userIcon, teamIcon } from '@asap-hub/react-components';

export default {
  title: 'Atoms / Toggle',
};

export const Normal = () => {
  return (
    <Toggle
      leftButtonText="People"
      leftButtonIcon={userIcon}
      rightButtonText="Teams"
      rightButtonIcon={teamIcon}
      position={boolean('Toggled', false) ? 'left' : 'right'}
      onChange={() => action('Toggle Changed')}
    />
  );
};
