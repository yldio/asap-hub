import { Info } from '@asap-hub/react-components';
import { text } from '@storybook/addon-knobs';

import { CenterDecorator } from './layout';

export default {
  title: 'Molecules / Info Popup',
  component: Info,
  decorators: [CenterDecorator],
};

export const Normal = () => <Info>{text('Tooltip text', 'Tooltip text')}</Info>;
