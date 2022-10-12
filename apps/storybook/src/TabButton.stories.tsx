import { TabButton } from '@asap-hub/react-components';
import { boolean, text } from '@storybook/addon-knobs';

export default {
  title: 'Atoms / Navigation / Tab Button',
};

export const Normal = () => (
  <TabButton active={boolean('Active ?', true)}>
    {text('Button label', 'Tab Button')}
  </TabButton>
);
