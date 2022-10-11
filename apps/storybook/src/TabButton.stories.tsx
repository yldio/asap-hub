import { TabButton } from '@asap-hub/react-components';
import { boolean, text } from '@storybook/addon-knobs';

export default {
  title: 'Atoms / Navigation / Tab Button',
};

export const Active = () => (
  <TabButton
    active={boolean('Active?', true)}
    disabled={boolean('Disabled ?', false)}
  >
    {text('Text', 'Overview')}
  </TabButton>
);

export const Inactive = () => (
    <TabButton
      active={boolean('Active?', false)}
      disabled={boolean('Disabled ?', false)}
    >
      {text('Text', 'Overview')}
    </TabButton>
  );
  