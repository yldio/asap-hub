import { Pill } from '@asap-hub/react-components';
import { boolean, select, text } from '@storybook/addon-knobs';

export default {
  title: 'Atoms / Pill',
};

export const Normal = () => (
  <Pill
    accent={select(
      'Accent',
      ['default', 'green', 'warning', 'info', 'neutral'],
      'default',
    )}
    small={boolean('Small', true)}
  >
    {text('Text', 'Publication')}
  </Pill>
);
