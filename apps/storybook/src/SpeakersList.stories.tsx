import { createEventResponse } from '@asap-hub/fixtures';
import { SpeakersList } from '@asap-hub/react-components';
import { boolean, number } from '@storybook/addon-knobs';

export default {
  title: 'Organisms / Events / Speakers List',
};

export const Normal = () => (
  <SpeakersList
    {...createEventResponse({
      numberOfSpeakers: number('Number of speakers', 4),
      numberOfUnknownSpeakers: number('Number of unknown speakers', 2),
      isEventInThePast: boolean('Has the event passed', false),
    })}
  />
);
