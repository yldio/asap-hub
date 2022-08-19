import { ComponentProps } from 'react';
import { ConfirmModal } from '@asap-hub/react-components';
import { StaticRouter } from 'react-router-dom';
import { text } from '@storybook/addon-knobs';

export default {
  title: 'Organisms / Confirm Modal',
  component: ConfirmModal,
};

const props: ComponentProps<typeof ConfirmModal> = {
  backHref: '#wrong',
  successHref: '#wrong',
  title: text('title', 'Ready to publish your profile?'),
  description: text(
    'description',
    'In order to show you the Hub, we will need to make your profile public to the Hub network. Would you like to continue?',
  ),
  cancelText: text('Cancel Text', 'Back to Editing'),
  confirmText: text('Confirm Text', 'Publish and Explore'),
};

export const Normal = () => (
  <StaticRouter>
    <ConfirmModal {...props} />
  </StaticRouter>
);
