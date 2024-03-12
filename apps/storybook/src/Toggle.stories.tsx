import { action } from '@storybook/addon-actions';
import { Toggle, UserIcon, TeamIcon } from '@asap-hub/react-components';

import { boolean, text } from './knobs';

export default {
  title: 'Atoms / Toggle',
};

export const Normal = () => (
  <Toggle
    leftButtonText={text('Left Text', 'People')}
    leftButtonIcon={<UserIcon />}
    rightButtonText={text('Right Text', 'Teams')}
    rightButtonIcon={<TeamIcon />}
    position={boolean('Toggled', false) ? 'right' : 'left'}
    onChange={() => action('Toggle Changed')}
  />
);
