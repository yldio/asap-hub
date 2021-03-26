import React, { ComponentProps } from 'react';
import { text } from '@storybook/addon-knobs';
import { EventConversation } from '@asap-hub/react-components';
import { createGroupResponse } from '@asap-hub/fixtures';

export default {
  title: 'Organisms / Events / Conversation',
  component: EventConversation,
};

const props = (): ComponentProps<typeof EventConversation> => ({
  ...createGroupResponse(),
  tools: {
    slack: text('Slack', 'http://example.com'),
  },
});

export const Normal = () => <EventConversation {...props()} />;
