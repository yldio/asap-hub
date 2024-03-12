import { ComponentProps } from 'react';
import { text } from './knobs';

import { ToolCard } from '@asap-hub/react-components';

export default {
  title: 'Organisms / Team Profile / Tool Card',
};

const ToolCardProps = (): ComponentProps<typeof ToolCard> => ({
  name: text('Name', 'Slack (#team-ferguson)'),
  description: text(
    'Description',
    'Chat privately with your team members or seek out others in the ASAP Networks',
  ),
  editHref: '/wrong',
  url: text('Tool Url', 'http://example.com'),
});

export const Normal = () => <ToolCard {...ToolCardProps()} />;
