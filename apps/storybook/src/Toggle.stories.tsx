import React from 'react';
import { boolean, text } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import { Toggle, userIcon, teamIcon } from '@asap-hub/react-components';

export default {
  title: 'Atoms / Toggle',
};

export const Normal = () => (
  <Toggle
    leftButtonText={text('Left Text', 'People')}
    leftButtonIcon={userIcon}
    rightButtonText={text('Right Text', 'Teams')}
    rightButtonIcon={teamIcon}
    position={boolean('Toggled', false) ? 'right' : 'left'}
    onChange={() => action('Toggle Changed')}
  />
);
