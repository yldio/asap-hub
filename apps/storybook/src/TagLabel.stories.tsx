import { TagLabel } from '@asap-hub/react-components';
import { text } from '@storybook/addon-knobs';

export default {
  title: 'Atoms / Tag Label',
};

export const Normal = () => <TagLabel>{text('Text', 'Publication')}</TagLabel>;
