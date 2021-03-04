import React from 'react';

import { EventNotes } from '@asap-hub/react-components';
import { text } from '@storybook/addon-knobs';

export default {
  title: 'Organisms / Events / Notes',
  component: EventNotes,
};

export const Normal = () => (
  <EventNotes
    notes={text('Rich Text Notes', '<strong>Important</strong> note')}
  />
);
