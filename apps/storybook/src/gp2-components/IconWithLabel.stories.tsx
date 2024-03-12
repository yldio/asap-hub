import { IconWithLabel, projectIcon } from '@asap-hub/gp2-components';
import { text } from '../knobs';

export default {
  title: 'GP2 / Molecules / Icon With Label',
  component: IconWithLabel,
};
export const Normal = () => (
  <IconWithLabel icon={projectIcon}>{text('label', 'label')}</IconWithLabel>
);
