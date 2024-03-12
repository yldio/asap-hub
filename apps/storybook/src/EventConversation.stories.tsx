import { ComponentProps } from 'react';
import { EventConversation } from '@asap-hub/react-components';
import {
  createEventResponse,
  createInterestGroupResponse,
} from '@asap-hub/fixtures';

import { text } from './knobs';

export default {
  title: 'Organisms / Events / Conversation',
  component: EventConversation,
};

const props = (): ComponentProps<typeof EventConversation> => ({
  ...createEventResponse(),
  interestGroup: {
    ...createInterestGroupResponse(),
    tools: {
      slack: text('Slack', 'http://example.com'),
    },
  },
});

export const Normal = () => <EventConversation {...props()} />;
