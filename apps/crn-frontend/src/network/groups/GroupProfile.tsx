import { FC, lazy, useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid';

import { GroupProfilePage, NotFoundPage } from '@asap-hub/react-components';
import { network, useRouteParams } from '@asap-hub/routing';

import { useUpcomingAndPastEvents } from '../events';
import ProfileSwitch from '../ProfileSwitch';

import { useGroupById } from './state';

const loadAbout = () =>
  import(/* webpackChunkName: "network-group-about" */ './About');
const loadCalendar = () =>
  import(/* webpackChunkName: "network-group-calendar" */ './Calendar');
const loadEventsList = () =>
  import(/* webpackChunkName: "network-events" */ '../EventsEmbedList');

const About = lazy(loadAbout);
const Calendar = lazy(loadCalendar);
loadAbout();

type GroupProfileProps = {
  currentTime: Date;
};

const GroupProfile: FC<GroupProfileProps> = ({ currentTime }) => {
  const route = network({}).groups({}).group;
  const [groupTeamsElementId] = useState(`group-teams-${uuid()}`);

  const { groupId } = useRouteParams(route);
  const group = useGroupById(groupId);

  useEffect(() => {
    loadAbout().then(loadCalendar).then(loadEventsList);
  }, []);

  const [upcomingEvents, pastEvents] = useUpcomingAndPastEvents(currentTime, {
    groupId,
  });

  if (group) {
    return (
      <GroupProfilePage
        groupTeamsHref={`${
          route({ groupId }).about({}).$
        }#${groupTeamsElementId}`}
        upcomingEventsCount={upcomingEvents.total}
        pastEventsCount={pastEvents.total}
        numberOfTeams={
          group.teams.filter(({ inactiveSince }) => !inactiveSince).length
        }
        {...group}
      >
        <ProfileSwitch
          About={() => (
            <About group={group} groupTeamsElementId={groupTeamsElementId} />
          )}
          Calendar={() => <Calendar calendars={group.calendars} />}
          currentTime={currentTime}
          displayName={group.name}
          eventConstraint={{ groupId }}
          isActive={group.active}
          route={route({ groupId })}
          type="group"
        />
      </GroupProfilePage>
    );
  }

  return <NotFoundPage />;
};

export default GroupProfile;
