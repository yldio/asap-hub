import { createEventResponse } from '@asap-hub/fixtures';
import { SpeakersList } from '@asap-hub/react-components';
import { subHours } from 'date-fns';

export default {
  title: 'Organisms / Events / Speakers List',
};

const eventInThePast = {
  ...createEventResponse(),
  endDate: subHours(new Date(), 10).toISOString(),
};

export const Normal = () => <SpeakersList {...createEventResponse()} />;

export const InThePast = () => <SpeakersList {...eventInThePast} />;
