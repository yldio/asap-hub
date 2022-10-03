import { text } from '@storybook/addon-knobs';
import { Toast } from '@asap-hub/react-components';
import { NoPaddingDecorator } from './layout';

export default {
  title: 'Organisms / Toast',
  component: Toast,
  decorators: [NoPaddingDecorator],
};

export const Normal = () => (
  <Toast>{text('Message', 'Something happened.')}</Toast>
);

export const Info = () => (
  <Toast accent="info">{text('Message', 'Something happened.')}</Toast>
);

export const Closable = () => (
  <Toast onClose={() => {}}>{text('Message', 'Something happened.')}</Toast>
);
