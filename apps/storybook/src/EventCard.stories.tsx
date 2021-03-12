import React, { ComponentProps } from 'react';
import { EventStatus } from '@asap-hub/model';
import { array, select, text } from '@storybook/addon-knobs';
import { EventCard } from '@asap-hub/react-components';
import { createEventResponse } from '@asap-hub/fixtures';

import { CenterDecorator } from './layout';

export default {
  title: 'Organisms / Events / Card',
  component: EventCard,
  decorators: [CenterDecorator],
};

const props = (): ComponentProps<typeof EventCard> => ({
  ...createEventResponse(),
  title: text('Event Name', 'Example Event'),
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
