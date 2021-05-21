import { ToastCard } from '@asap-hub/react-components';
import { select, text } from '@storybook/addon-knobs';

export default {
  title: 'Molecules / Toast Card',
};

export const Normal = () => (
  <ToastCard
    type={select('Type', ['alert', 'live', 'attachment'], 'alert')}
    toastContent={text('Toast Content', '')}
  >
    content
  </ToastCard>
);
