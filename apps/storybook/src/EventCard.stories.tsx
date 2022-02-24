import { ComponentProps } from 'react';
import { EventStatus } from '@asap-hub/model';
import { array, boolean, date, select, text } from '@storybook/addon-knobs';
import { EventCard } from '@asap-hub/react-components';
import { createEventResponse, createGroupResponse } from '@asap-hub/fixtures';
import { addHours } from 'date-fns';

import { CenterDecorator } from './layout';

export default {
  title: 'Organisms / Events / Card',
  component: EventCard,
  decorators: [CenterDecorator],
};

const meetingMaterialOptions = ['Yes', 'No', 'Coming Soon'];
const meetingMaterialValue = (option: string) =>
  option === 'Yes' ? 'example' : option === 'No' ? null : undefined;
const props = (): ComponentProps<typeof EventCard> => {
  const meetingMaterials = select(
    'Meeting Materials',
    ['Yes', 'No', 'Coming Soon'],
    'Coming Soon',
    'Meeting Material',
  );

  return {
    ...createEventResponse(),
    title: text('Event Name', 'Example Event'),
    group: boolean('has group', true) ? createGroupResponse() : undefined,
    status: select<EventStatus>(
      'Status',
      ['Cancelled', 'Confirmed', 'Tentative'],
      'Confirmed',
    ),
    tags: array('Expertise and Resources', [
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
        meetingMaterialOptions,
        'Coming Soon',
        'Meeting Material',
      ),
    ),
    notes: meetingMaterialValue(
      select(
        'Notes',
        meetingMaterialOptions,
        'Coming Soon',
        'Meeting Material',
      ),
    ),
    videoRecording: meetingMaterialValue(
      select(
        'Video Recording',
        meetingMaterialOptions,
        'Coming Soon',
        'Meeting Material',
      ),
    ),
    meetingLink: boolean('has meeting link', true)
      ? 'http://example.com'
      : undefined,
    hideMeetingLink: boolean('hide meeting Link', false),
    meetingMaterials:
      meetingMaterials === 'Yes'
        ? [{ title: 'example', url: 'http://example.com' }]
        : meetingMaterials === 'Coming Soon'
        ? []
        : null,

    startDate: new Date(
      date('Start Date', addHours(new Date(), 23)),
    ).toISOString(),
    endDate: new Date(date('End Date', addHours(new Date(), 24))).toISOString(),
  };
};

export const Normal = () => <EventCard {...props()} />;
