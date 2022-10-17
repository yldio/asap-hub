import { projectIcon, IconWithLabel } from '@asap-hub/gp2-components';
import { text } from '@storybook/addon-knobs';

export default {
  title: 'GP2 / Molecules / Icon With Label',
  component: IconWithLabel,
};
export const Normal = () => (
  <IconWithLabel icon={projectIcon}>{text('label', 'label')}</IconWithLabel>
);
