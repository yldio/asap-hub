import { boolean, text } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import { Toggle, UserIcon, TeamIcon } from '@asap-hub/react-components';

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
