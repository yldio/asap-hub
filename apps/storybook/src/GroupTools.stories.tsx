import React, { ComponentProps } from 'react';
import { GroupTools } from '@asap-hub/react-components';

export default {
  title: 'Molecules / Group / Tools',
};

const props = (): ComponentProps<typeof GroupTools> => ({
  tools: {
    googleCalendar: 'http://calendar.google.com/r/calendar?12w3',
    googleDrive: 'http://drive.google.com/123',
    slack: 'http://test.slack.com',
  },
});

export const Normal = () => <GroupTools {...props()} />;
