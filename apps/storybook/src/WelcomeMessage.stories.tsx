import { WelcomeMessage } from '@asap-hub/react-components';
import { text } from './knobs';

import { MessageLayoutDecorator } from './layout';

export default {
  title: 'Messages / Welcome',
  component: WelcomeMessage,
  decorators: [MessageLayoutDecorator],
};

export const Normal = () => (
  <WelcomeMessage
    firstName={text('First Name', 'John')}
    link={text('Link', 'https://example.com/register')}
  />
);
