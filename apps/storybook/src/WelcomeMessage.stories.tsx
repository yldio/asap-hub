import { WelcomeMessage } from '@asap-hub/react-components';
import { text } from '@storybook/addon-knobs';

import { MessageLayoutDecorator } from './layout';

export default {
  title: 'Messages / Welcome',
  component: WelcomeMessage,
  decorators: [MessageLayoutDecorator],
};

export const InviteScript = () => (
  <WelcomeMessage
    firstName={text('First Name', 'John')}
    link={text('Link', 'https://example.com/register')}
  />
);

export const Invite = () => (
  <WelcomeMessage
    firstName={text('First Name', 'John')}
    link={text('Link', 'https://example.com/register')}
    variant={'InviteWelcomeTemplate'}
  />
);
