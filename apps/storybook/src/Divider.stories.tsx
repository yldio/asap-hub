import { Divider } from '@asap-hub/react-components';

import { text } from './knobs';

export default {
  title: 'Atoms / Divider',
  component: Divider,
};

export const Normal = () => <Divider />;

export const Text = () => <Divider>{text('Text', 'or')}</Divider>;
