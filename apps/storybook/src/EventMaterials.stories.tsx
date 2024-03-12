import { EventMaterials } from '@asap-hub/react-components';
import { createEventResponse } from '@asap-hub/fixtures';
import { subDays } from 'date-fns';

import { boolean, date, number, text } from './knobs';

export default {
  title: 'Organisms / Events / Materials',
  component: EventMaterials,
};

export const Normal = () => (
  <EventMaterials
    endDate={new Date(date('End Date', subDays(new Date(), 1))).toISOString()}
    notes={boolean('Notes Unavailable', false) ? null : text('Notes', '')}
    videoRecording={
      boolean('Video recording unavailable', false)
        ? null
        : text(
            'Video recording',
            '<iframe src="https://player.vimeo.com/video/507828845" width="640" height="400" frameborder="0" allowfullscreen="allowfullscreen"></iframe>',
          )
    }
    presentation={
      boolean('Presentation unavailable', true)
        ? null
        : text('Presentation', '')
    }
    meetingMaterials={
      boolean('Additional materials unavailable', false)
        ? null
        : createEventResponse({
            meetingMaterials: number('Number of additional materials', 2),
          }).meetingMaterials
    }
  />
);
