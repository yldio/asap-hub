import { FC, lazy, useEffect, useState } from 'react';
import { useRouteMatch } from 'react-router-dom';
import { v4 as uuid } from 'uuid';

import {
  InterestGroupProfilePage,
  NotFoundPage,
} from '@asap-hub/react-components';
import { network, useRouteParams } from '@asap-hub/routing';

import { useUpcomingAndPastEvents } from '../events';
import ProfileSwitch from '../ProfileSwitch';

import { useInterestGroupById } from './state';

const loadAbout = () =>
  import(/* webpackChunkName: "network-group-about" */ './About');
const loadCalendar = () =>
  import(/* webpackChunkName: "network-group-calendar" */ './Calendar');
const loadEventsList = () =>
  import(/* webpackChunkName: "network-events" */ '../EventsEmbedList');

const About = lazy(loadAbout);
const Calendar = lazy(loadCalendar);
loadAbout();

type InterestGroupProfileProps = {
  currentTime: Date;
};

const InterestGroupProfile: FC<InterestGroupProfileProps> = ({
  currentTime,
}) => {
  const { path } = useRouteMatch();
  const route = network({}).groups({}).group;
  const [groupTeamsElementId] = useState(`group-teams-${uuid()}`);

  const { groupId } = useRouteParams(route);
  const interestGroup = useInterestGroupById(groupId);

  useEffect(() => {
    loadAbout().then(loadCalendar).then(loadEventsList);
  }, []);

  const [upcomingEvents, pastEvents] = useUpcomingAndPastEvents(currentTime, {
    groupId,
  });

  if (interestGroup) {
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
      <InterestGroupProfilePage
        groupTeamsHref={`${
          route({ groupId }).about({}).$
        }#${groupTeamsElementId}`}
        upcomingEventsCount={upcomingEvents?.total || 0}
        pastEventsCount={pastEvents?.total || 0}
        numberOfTeams={
          interestGroup.teams.filter(({ inactiveSince }) => !inactiveSince)
            .length
        }
        {...interestGroup}
      >
        <ProfileSwitch
          About={() => (
            <About
              interestGroup={interestGroup}
              interestGroupTeamsElementId={groupTeamsElementId}
            />
          )}
          Calendar={() => (
            <Calendar
              calendars={interestGroup.calendars}
              groupType="interest"
            />
          )}
          currentTime={currentTime}
          displayName={interestGroup.name}
          eventConstraint={{ groupId }}
          isActive={interestGroup.active}
          paths={paths}
          type="interest group"
        />
      </InterestGroupProfilePage>
    );
  }

  return <NotFoundPage />;
};

export default InterestGroupProfile;
