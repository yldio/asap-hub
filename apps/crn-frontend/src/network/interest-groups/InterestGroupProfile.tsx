import {
  InterestGroupProfilePage,
  NotFoundPage,
} from '@asap-hub/react-components';
import { networkRoutes } from '@asap-hub/routing';
import { FC, lazy, useEffect, useState } from 'react';
import { useTypedParams } from 'react-router-typesafe-routes/dom';
import { v4 as uuid } from 'uuid';

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
  const route = networkRoutes.DEFAULT.INTEREST_GROUPS.DETAILS;
  const { interestGroupId } = useTypedParams(route);

  const [groupTeamsElementId] = useState(`group-teams-${uuid()}`);

  const interestGroup = useInterestGroupById(interestGroupId);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    loadAbout().then(loadCalendar).then(loadEventsList);
  }, []);

  const [upcomingEvents, pastEvents] = useUpcomingAndPastEvents(currentTime, {
    interestGroupId,
  });

  if (interestGroup) {
    const paths = {
      about: route.ABOUT.buildPath({ interestGroupId }),
      calendar: route.CALENDAR.buildPath({ interestGroupId }),
      past: route.PAST.buildPath({ interestGroupId }),
      upcoming: route.UPCOMING.buildPath({ interestGroupId }),
    };

    return (
      <InterestGroupProfilePage
        // groupTeamsHref={`${
        //   route({ interestGroupId }).about({}).$
        // }#${groupTeamsElementId}`}
        // TODO: fix this
        groupTeamsHref={route.ABOUT.buildPath({ interestGroupId })}
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
