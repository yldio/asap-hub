import React, { ComponentProps } from 'react';
import { EventStatus } from '@asap-hub/model';

import { array, select } from '@storybook/addon-knobs';
import { EventCard } from '@asap-hub/react-components';
import { createGroupResponse, createEventResponse } from '@asap-hub/fixtures';

export default {
  title: 'Organisms / Event Card',
  component: EventCard,
};

const props = (): ComponentProps<typeof EventCard> => ({
  ...createEventResponse(),
  groups: createEventResponse().groups.map((_, index) => ({
    ...createGroupResponse({}, index),
    href: '#',
  })),
  status: select<EventStatus>(
    'Status',
    ['Cancelled', 'Confirmed', 'Tentative'],
    'Confirmed',
  ),
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
