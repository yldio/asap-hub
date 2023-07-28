import { ComponentProps } from 'react';
import { InterestGroupTools } from '@asap-hub/react-components';
import { boolean, text } from '@storybook/addon-knobs';

export default {
  title: 'Organisms / Interest Group Profile / Tools',
};

const props = (): ComponentProps<typeof InterestGroupTools> => ({
  calendarId: text('Calendar', 'hub@asap.science'),
  active: boolean('Group Active', true),
  tools: {
    googleDrive: text('Google Drive', 'http://drive.google.com/123'),
    slack: text('Slack', 'http://test.slack.com'),
  },
});

export const Normal = () => <InterestGroupTools {...props()} />;
