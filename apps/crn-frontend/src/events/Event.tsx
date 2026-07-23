import {
  EventAttendance,
  EventConversation,
  EventDetailPage,
  eventMapper,
  EventOwner,
  EventPage,
  getIconForDocumentType,
  NotFoundPage,
  noop,
  SpeakerList,
  useDateHasPassed,
  considerEndedAfter,
  PageConstraints,
} from '@asap-hub/react-components';
import { useCurrentUserCRN, useFlags } from '@asap-hub/react-context';
import { EventResponse } from '@asap-hub/model';
import { events, useRouteParams } from '@asap-hub/routing';
import { Frame, useBackHref } from '@asap-hub/frontend-utils';

import { useEventById, useQuietRefreshEventById } from './state';

const mapAttendanceTeams = (attendance: EventResponse['attendance'] = []) =>
  attendance.map(({ team, attended }) => ({
    teamId: team.id,
    teamName: team.displayName,
    attended,
    teamType:
      team.teamType === 'Discovery Team'
        ? ('discovery' as const)
        : team.teamType === 'Resource Team'
          ? ('resource' as const)
          : undefined,
    isTeamInactive: !!team.inactiveSince,
  }));

const Event: React.FC = () => {
  const { eventId } = useRouteParams(events({}).event);
  const event = useEventById(eventId);
  const refreshEvent = useQuietRefreshEventById(eventId);
  const backHref = useBackHref() ?? events({}).$;
  const { isEnabled } = useFlags();
  const user = useCurrentUserCRN();

  const hasFinished = useDateHasPassed(
    considerEndedAfter(event?.endDate || ''),
  );

  if (event) {
    const displayCalendar =
      event.interestGroup === undefined || event.interestGroup.active;

    const teams = mapAttendanceTeams(event.attendance);
    const teamsTotal = teams.length;
    const teamsAttended = teams.filter(({ attended }) => attended).length;
    const isEventProjectManager = !!user?.interestGroups.some(
      (ig) =>
        ig.id === event.interestGroup?.id && ig.role === 'Project Manager',
    );
    const attendance = hasFinished ? (
      <EventAttendance
        teamsAttended={teamsAttended}
        teamsTotal={teamsTotal}
        teams={teams}
        sinceLastEvent={
          event.previousEventAttendance && {
            count: teamsAttended - event.previousEventAttendance.teamsAttended,
            teamsAttended: event.previousEventAttendance.teamsAttended,
            teamsTotal: event.previousEventAttendance.teamsTotal,
          }
        }
        onAddAttendance={isEventProjectManager ? noop : undefined}
      />
    ) : undefined;

    if (isEnabled('NEW_EVENT_PAGE')) {
      return (
        <Frame title={event.title}>
          <EventDetailPage
            {...eventMapper(event)}
            hasFinished={hasFinished}
            backHref={backHref}
            onRefresh={refreshEvent}
            getIconForDocumentType={getIconForDocumentType}
            displayCalendar={displayCalendar}
            eventConversation={<EventConversation {...event} />}
            eventAttendance={attendance}
          >
            {!!event.speakers.length && <SpeakerList {...event} />}
          </EventDetailPage>
        </Frame>
      );
    }

    return (
      <Frame title={event.title}>
        <PageConstraints>
          <EventPage
            {...event}
            hasFinished={hasFinished}
            tags={event.tags.map((tag) => tag.name)}
            backHref={backHref}
            onRefresh={refreshEvent}
            getIconForDocumentType={getIconForDocumentType}
            displayCalendar={displayCalendar}
            eventConversation={<EventConversation {...event} />}
            eventOwner={
              <EventOwner
                interestGroup={event.interestGroup}
                workingGroup={event.workingGroup}
              />
            }
          >
            {!!event.speakers.length && <SpeakerList {...event} />}
          </EventPage>
        </PageConstraints>
      </Frame>
    );
  }

  return <NotFoundPage />;
};

export default Event;
