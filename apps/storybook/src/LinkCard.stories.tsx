import React, { ComponentProps } from 'react';
import { text } from '@storybook/addon-knobs';

import { LinkCard } from '@asap-hub/react-components';
import { action } from '@storybook/addon-actions';

export default {
  title: 'Organisms / Link Card',
};

const linkCardProps = (): ComponentProps<typeof LinkCard> => ({
  name: text('Name', 'Slack (#team-ferguson)'),
  description: text(
    'Description',
    'Chat privately with your team members or seek out others in the ASAP Networks',
  ),
  onClick: action('Edit link'),
});

export const Normal = () => <LinkCard {...linkCardProps()} />;
