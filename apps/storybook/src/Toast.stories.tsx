import { noop, Toast } from '@asap-hub/react-components';

import { boolean, text } from './knobs';
import { NoPaddingDecorator } from './layout';

export default {
  title: 'Organisms / Toast',
  component: Toast,
  decorators: [NoPaddingDecorator],
};

export const Normal = () => (
  <Toast onClose={boolean('closable', true) ? noop : undefined}>
    {text('Message', 'Something happened.')}
  </Toast>
);

export const Info = () => (
  <Toast onClose={boolean('closable', true) ? noop : undefined} accent="info">
    {text('Message', 'Something happened.')}
  </Toast>
);
export const Warning = () => (
  <Toast
    onClose={boolean('closable', true) ? noop : undefined}
    accent="warning"
  >
    {text('Message', 'Something happened.')}
  </Toast>
);
