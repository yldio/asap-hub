import { FC, lazy, useEffect, useState } from 'react';
import { useMatch } from 'react-router-dom';
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

type InterestGroupProfileProps = {
  currentTime: Date;
};

const InterestGroupProfile: FC<InterestGroupProfileProps> = ({
  currentTime,
}) => {
  const { path } = useMatch();
  const route = network({}).interestGroups({}).interestGroup;
  const [groupTeamsElementId] = useState(`group-teams-${uuid()}`);

  const { interestGroupId } = useRouteParams(route);
  const interestGroup = useInterestGroupById(interestGroupId);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    loadAbout().then(loadCalendar).then(loadEventsList);
  }, []);

  const [upcomingEvents, pastEvents] = useUpcomingAndPastEvents(currentTime, {
    interestGroupId,
  });

  if (interestGroup) {
    const { about, past, upcoming, calendar } = route({
      interestGroupId,
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
          route({ interestGroupId }).about({}).$
        }#${groupTeamsElementId}`}
        upcomingEventsCount={upcomingEvents?.total || 0}
        pastEventsCount={pastEvents?.total || 0}
        numberOfTeams={
          interestGroup.teams.filter(({ inactiveSince }) => !inactiveSince)
            .length
        }
        {...interestGroup}
        calendarId={interestGroup.calendars[0]?.id}
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
          eventConstraint={{ interestGroupId }}
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
