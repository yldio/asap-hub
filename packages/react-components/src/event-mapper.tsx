import { EventResponse } from '@asap-hub/model';
import { EventNumberOfSpeakers, EventOwner, EventTeams } from './molecules';

export const eventMapper = ({
  speakers,
  interestGroup,
  workingGroup,
  ...event
}: EventResponse) => ({
  ...event,
  tags: event.tags.map(({ name }) => name),
  hasSpeakersToBeAnnounced: !!(
    speakers.length === 0 ||
    speakers.find((speaker) => 'team' in speaker && !('user' in speaker))
  ),
  eventTeams: <EventTeams speakers={speakers} />,
  eventSpeakers: <EventNumberOfSpeakers speakers={speakers} />,
  eventOwner: (
    <EventOwner interestGroup={interestGroup} workingGroup={workingGroup} />
  ),
});
