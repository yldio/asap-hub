import { text } from './knobs';

import { Divider } from '@asap-hub/react-components';

export default {
  title: 'Atoms / Divider',
  component: Divider,
};

export const Normal = () => <Divider />;

export const Text = () => <Divider>{text('Text', 'or')}</Divider>;
