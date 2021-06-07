import { Pill } from '@asap-hub/react-components';
import { text } from '@storybook/addon-knobs';

export default {
  title: 'Atoms / Pill',
};

export const Normal = () => <Pill>{text('Text', 'Publication')}</Pill>;
