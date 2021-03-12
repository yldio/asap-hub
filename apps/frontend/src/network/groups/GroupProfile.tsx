import React, { useState, useEffect } from 'react';
import { useRouteMatch, Switch, Route, Redirect } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import { GroupProfilePage, NotFoundPage } from '@asap-hub/react-components';
import { network, useRouteParams } from '@asap-hub/routing';

import { useGroupById } from './state';
import Frame from '../../structure/Frame';

const loadAbout = () =>
  import(/* webpackChunkName: "network-group-about" */ './About');
const loadCalendar = () =>
  import(/* webpackChunkName: "network-group-calendar" */ './Calendar');
const loadEventList = () =>
  import(
    /* webpackChunkName: "network-group-event-list" */ './events/EventList'
  );

const About = React.lazy(loadAbout);
const Calendar = React.lazy(loadCalendar);
const EventList = React.lazy(loadEventList);
loadAbout();

const GroupProfile: React.FC = () => {
  useEffect(() => {
    loadAbout().then(loadCalendar).then(loadEventList);
  }, []);

  const [groupTeamsElementId] = useState(`group-teams-${uuid()}`);
  const [currentTime] = useState(new Date());

  const route = network({}).groups({}).group;
  const { groupId } = useRouteParams(route);
  const { path } = useRouteMatch();
  const group = useGroupById(groupId);

  if (group) {
    return (
      <GroupProfilePage
        id={group.id}
        name={group.name}
        lastModifiedDate={group.lastModifiedDate}
        numberOfTeams={group.teams.length}
        groupTeamsHref={`${
          route({ groupId }).about({}).$
        }#${groupTeamsElementId}`}
      >
        <Frame>
          <Switch>
            <Route path={path + route({ groupId }).about.template}>
              <About group={group} groupTeamsElementId={groupTeamsElementId} />
            </Route>
            <Route path={path + route({ groupId }).calendar.template}>
              <Calendar calendars={group.calendars} />
            </Route>
            <Route path={path + route({ groupId }).upcoming.template}>
              <EventList currentTime={currentTime} />
            </Route>
            <Route path={path + route({ groupId }).past.template}>
              <EventList past currentTime={currentTime} />
            </Route>
            <Redirect to={route({ groupId }).about({}).$} />
          </Switch>
        </Frame>
      </GroupProfilePage>
    );
  }

  return <NotFoundPage />;
};

export default GroupProfile;
