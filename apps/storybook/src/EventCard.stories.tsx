import React, { ComponentProps } from 'react';
import { EventStatus } from '@asap-hub/model';
import { array, boolean, select, text } from '@storybook/addon-knobs';
import { EventCard } from '@asap-hub/react-components';
import { createEventResponse } from '@asap-hub/fixtures';
import { subHours, addHours } from 'date-fns';

import { CenterDecorator } from './layout';

export default {
  title: 'Organisms / Events / Card',
  component: EventCard,
  decorators: [CenterDecorator],
};

const meetingMaterialOption = ['Yes', 'No', 'Coming Soon'];
const meetingMaterialValue = (option: string) =>
  option === 'Yes' ? 'example' : option === 'No' ? null : undefined;
const props = (): ComponentProps<typeof EventCard> => {
  const meetingDates = select(
    'Meeting Dates',
    ['future', 'now', 'past'],
    'future',
  );
  const meetingMaterials = select(
    'Meeting Materials',
    ['Yes', 'No', 'Coming Soon'],
    'Coming Soon',
    'Meeting Material',
  );

  return {
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
    presentation: meetingMaterialValue(
      select(
        'Presentation',
        meetingMaterialOption,
        'Coming Soon',
        'Meeting Material',
      ),
    ),
    notes: meetingMaterialValue(
      select('Notes', meetingMaterialOption, 'Coming Soon', 'Meeting Material'),
    ),
    videoRecording: meetingMaterialValue(
      select(
        'Video Recording',
        meetingMaterialOption,
        'Coming Soon',
        'Meeting Material',
      ),
    ),
    meetingLink: boolean('has meeting link', true)
      ? 'http://example.com'
      : undefined,
    meetingMaterials:
      meetingMaterials === 'Yes'
        ? [{ title: 'example', url: 'http://example.com' }]
        : meetingMaterials === 'Coming Soon'
        ? []
        : null,
    ...(meetingDates === 'future'
      ? {
          startDate: addHours(new Date(), 23).toISOString(),
          endDate: addHours(new Date(), 24).toISOString(),
        }
      : meetingDates === 'now'
      ? {
          startDate: subHours(new Date(), 1).toISOString(),
          endDate: addHours(new Date(), 1).toISOString(),
        }
      : {
          startDate: subHours(new Date(), 24).toISOString(),
          endDate: subHours(new Date(), 23).toISOString(),
        }),
  };
};

export const Normal = () => <EventCard {...props()} />;
