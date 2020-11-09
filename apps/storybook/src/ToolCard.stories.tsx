import React, { ComponentProps } from 'react';
import { text } from '@storybook/addon-knobs';

import { ToolCard } from '@asap-hub/react-components';

export default {
  title: 'Organisms / Tool Card',
};

const ToolCardProps = (): ComponentProps<typeof ToolCard> => ({
  name: text('Name', 'Slack (#team-ferguson)'),
  description: text(
    'Description',
    'Chat privately with your team members or seek out others in the ASAP Networks',
  ),
  href: '/wrong',
  url: text('Tool Url', 'http://example.com'),
});

export const Normal = () => <ToolCard {...ToolCardProps()} />;
