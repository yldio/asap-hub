import React, { useState, useEffect } from 'react';
import { useRouteMatch, Switch, Route, Redirect } from 'react-router-dom';
import { join } from 'path';
import { v4 as uuid } from 'uuid';
import { GroupProfilePage, NotFoundPage } from '@asap-hub/react-components';

import { useGroupById } from './state';
import Frame from '../../structure/Frame';

const loadAbout = () =>
  import(/* webpackChunkName: "network-group-about" */ './About');
const loadCalendar = () =>
  import(/* webpackChunkName: "network-group-calendar" */ './Calendar');
const loadEventList = () =>
  import(/* webpackChunkName: "network-group-event-list" */ './EventList');

const About = React.lazy(loadAbout);
const Calendar = React.lazy(loadCalendar);
const EventList = React.lazy(loadEventList);
loadAbout();

const GroupProfile: React.FC = () => {
  useEffect(() => {
    loadAbout().then(loadCalendar).then(loadEventList);
  }, []);

  const [groupTeamsElementId] = useState(`group-teams-${uuid()}`);
  const {
    url,
    path,
    params: { id },
  } = useRouteMatch<{ id: string }>();
  const group = useGroupById(id);
  const [currentTime] = useState(new Date());

  if (group) {
    return (
      <GroupProfilePage
        name={group.name}
        lastModifiedDate={group.lastModifiedDate}
        numberOfTeams={group.teams.length}
        aboutHref={join(url, 'about')}
        calendarHref={join(url, 'calendar')}
        groupTeamsHref={`${join(url, 'about')}#${groupTeamsElementId}`}
        upcomingHref={join(url, 'upcoming')}
        pastHref={join(url, 'past')}
      >
        <Frame>
          <Switch>
            <Route path={`${path}/about`}>
              <About group={group} groupTeamsElementId={groupTeamsElementId} />
            </Route>
            <Route path={`${path}/calendar`}>
              <Calendar calendars={group.calendars} />
            </Route>
            <Route path={`${path}/upcoming`}>
              <EventList currentTime={currentTime} />
            </Route>
            <Route path={`${path}/past`}>
              <EventList past currentTime={currentTime} />
            </Route>
            <Redirect to={`${path}/about`} />
          </Switch>
        </Frame>
      </GroupProfilePage>
    );
  }

  return <NotFoundPage />;
};

export default GroupProfile;
