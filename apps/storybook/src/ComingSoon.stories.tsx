import { ComingSoon } from '@asap-hub/react-components';
import { text } from '@storybook/addon-knobs';

export default {
  title: 'Organisms / Coming Soon',
  component: ComingSoon,
};

export const Normal = () => (
  <ComingSoon>
    {text('Text', 'This is where the next cool feature will appear')}
  </ComingSoon>
);
