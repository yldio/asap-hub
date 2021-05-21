import { ComponentProps } from 'react';
import { text } from '@storybook/addon-knobs';
import { EventConversation } from '@asap-hub/react-components';
import { createEventResponse, createGroupResponse } from '@asap-hub/fixtures';

export default {
  title: 'Organisms / Events / Conversation',
  component: EventConversation,
};

const props = (): ComponentProps<typeof EventConversation> => ({
  ...createEventResponse(),
  group: {
    ...createGroupResponse(),
    tools: {
      slack: text('Slack', 'http://example.com'),
    },
  },
});

export const Normal = () => <EventConversation {...props()} />;
