import { FC, lazy, useEffect, useState } from 'react';
import { useRouteMatch } from 'react-router-dom';
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
  const { path } = useRouteMatch();
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
    const { about, past, upcoming, calendar } = route({
      groupId,
    });
    const paths = {
      about: path + about.template,
      calendar: path + calendar.template,
      past: path + past.template,
      upcoming: path + upcoming.template,
    };

    return (
      <GroupProfilePage
        groupTeamsHref={`${
          route({ groupId }).about({}).$
        }#${groupTeamsElementId}`}
        upcomingEventsCount={upcomingEvents?.total || 0}
        pastEventsCount={pastEvents?.total || 0}
        numberOfTeams={
          group.teams.filter(({ inactiveSince }) => !inactiveSince).length
        }
        {...group}
      >
        <ProfileSwitch
          About={() => (
            <About group={group} groupTeamsElementId={groupTeamsElementId} />
          )}
          Calendar={() => (
            <Calendar calendars={group.calendars} groupType="interest" />
          )}
          currentTime={currentTime}
          displayName={group.name}
          eventConstraint={{ groupId }}
          isActive={group.active}
          paths={paths}
          type="interest group"
        />
      </GroupProfilePage>
    );
  }

  return <NotFoundPage />;
};

export default GroupProfile;
