import { ComponentProps } from 'react';
import { GroupTools } from '@asap-hub/react-components';
import { boolean, text } from '@storybook/addon-knobs';

export default {
  title: 'Organisms / Group Profile / Tools',
};

const props = (): ComponentProps<typeof GroupTools> => ({
  calendarId: text('Calendar', 'hub@asap.science'),
  active: boolean('Group Active', true),
  tools: {
    googleDrive: text('Google Drive', 'http://drive.google.com/123'),
    slack: text('Slack', 'http://test.slack.com'),
  },
});

export const Normal = () => <GroupTools {...props()} />;
