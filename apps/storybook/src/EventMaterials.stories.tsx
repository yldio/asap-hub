import React from 'react';
import { EventMaterials } from '@asap-hub/react-components';
import { number, text } from '@storybook/addon-knobs';
import { createEventResponse } from '@asap-hub/fixtures';

export default {
  title: 'Organisms / Events / Materials',
  component: EventMaterials,
};

export const Normal = () => (
  <EventMaterials
    notes={text('Notes', '')}
    videoRecording={text(
      'Video recording',
      '<iframe src="https://player.vimeo.com/video/507828845" width="640" height="400" frameborder="0" allowfullscreen="allowfullscreen"></iframe>',
    )}
    presentation={text('Presentation', '')}
    meetingMaterials={
      createEventResponse({
        meetingMaterials: number('Number of additional materials', 2),
      }).meetingMaterials
    }
  />
);
