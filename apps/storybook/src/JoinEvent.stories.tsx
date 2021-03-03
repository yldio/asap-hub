import React from 'react';
import { JoinEvent } from '@asap-hub/react-components';
import { date, text } from '@storybook/addon-knobs';
import { subHours, addHours } from 'date-fns';

export default {
  title: 'Organisms / Events / Join',
  component: JoinEvent,
};

export const Normal = () => (
  <JoinEvent
    startDate={new Date(
      date('Start Date', subHours(new Date(), 1)),
    ).toISOString()}
    endDate={new Date(date('End Date', addHours(new Date(), 1))).toISOString()}
    meetingLink={text('Meeting Link', 'https://example.com/meeting')}
  />
);
