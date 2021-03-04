import React, { ComponentProps } from 'react';
import { EventInfo } from '@asap-hub/react-components';
import { date, number, text, boolean } from '@storybook/addon-knobs';
import { createGroupResponse } from '@asap-hub/fixtures';

export default {
  title: 'Molecules / Events / Info',
  component: EventInfo,
};

const props = (): ComponentProps<typeof EventInfo> => ({
  thumbnail: text('Thumbnail', 'https://placekitten.com/150/150'),
  startDate: new Date(
    date('Start Date', new Date(2021, 8, 6, 18)),
  ).toISOString(),
  titleLimit: boolean('Title unlimited', false) ? null : undefined,
  endDate: new Date(date('End Date', new Date(2021, 8, 6, 20))).toISOString(),
  title: text('Title', 'GBA/LRRK2 Convergence workshops'),
  groups: Array.from({ length: number('Group Count', 1) }).map((_, index) => ({
    ...createGroupResponse({}, index),
    href: '#',
  })),
});

export const Normal = () => <EventInfo {...props()} />;
