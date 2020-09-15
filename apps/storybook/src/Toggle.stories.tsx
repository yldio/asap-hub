import React from 'react';
import { action } from '@storybook/addon-actions';
import {
  Toggle,
  profileIcon,
  teamMembersIcon,
} from '@asap-hub/react-components';

export default {
  title: 'Atoms / Toggle',
};

export const Normal = () => {
  return (
    <Toggle
      leftButtonText="People"
      leftButtonIcon={profileIcon}
      rightButtonText="Teams"
      rightButtonIcon={teamMembersIcon}
      onChange={() => action('Toggle Changed')}
    />
  );
};
