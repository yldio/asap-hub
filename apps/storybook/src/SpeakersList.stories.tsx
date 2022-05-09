import { createEventResponse } from '@asap-hub/fixtures';
import { SpeakersList } from '@asap-hub/react-components';

export default {
  title: 'Organisms / Events / Speakers List',
};

export const Normal = () => <SpeakersList {...createEventResponse()} />;
