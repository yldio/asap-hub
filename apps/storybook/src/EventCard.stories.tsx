import React from 'react';

import { date, text, number, array } from '@storybook/addon-knobs';
import { EventCard } from '@asap-hub/react-components';
import { createGroupResponse } from '@asap-hub/fixtures';

export default {
  title: 'Organisms / Event Card',
  component: EventCard,
};

const props = () => ({
  startDate: new Date(
    date('Start Date', new Date(2021, 8, 6, 18)),
  ).toISOString(),
  endDate: new Date(date('End Date', new Date(2021, 8, 6, 20))).toISOString(),
  title: text('Title', 'GBA/LRRK2 Convergence workshops'),
  groups: Array.from({ length: number('Group Count', 1) }).map((_, index) => ({
    ...createGroupResponse({}, index),
    href: '#',
  })),
  tags: array('Skills', [
    'Neurological Diseases',
    'Clinical Neurology',
    'Adult Neurology',
    'Neuroimaging',
    'Neurologic Examination',
    'Neuroprotection',
    'Movement Disorders',
    'Neurodegenerative Diseases',
    'Neurological Diseases',
  ]),
});

export const Normal = () => <EventCard {...props()} />;

export const Cancelled = () => <EventCard status="cancelled" {...props()} />;
