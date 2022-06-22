import { FC, lazy, useState, useEffect, ComponentProps } from 'react';
import { useRouteMatch, Switch, Route, Redirect } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import { GroupProfilePage, NotFoundPage } from '@asap-hub/react-components';
import { network, useRouteParams } from '@asap-hub/routing';
import { Frame } from '@asap-hub/frontend-utils';

import { useGroupById } from './state';
import { useSearch } from '../../hooks';
import { useEvents } from '../../events/state';
import { getEventListOptions } from '../../events/options';

const loadAbout = () =>
  import(/* webpackChunkName: "network-group-about" */ './About');
const loadCalendar = () =>
  import(/* webpackChunkName: "network-group-calendar" */ './Calendar');
const loadEventList = () =>
  import(
    /* webpackChunkName: "network-group-event-list" */ './events/EventList'
  );

const About = lazy(loadAbout);
const Calendar = lazy(loadCalendar);
const EventList = lazy(loadEventList);
loadAbout();

type GroupProfileProps = {
  currentTime: Date;
};

const GroupProfile: FC<GroupProfileProps> = ({ currentTime }) => {
  useEffect(() => {
    loadAbout().then(loadCalendar).then(loadEventList);
  }, []);

  const [groupTeamsElementId] = useState(`group-teams-${uuid()}`);

  const { searchQuery, setSearchQuery, debouncedSearchQuery } = useSearch();

  const route = network({}).groups({}).group;
  const { groupId } = useRouteParams(route);
  const { path } = useRouteMatch();
  const group = useGroupById(groupId);

  const upcomingEvents = useEvents(
    getEventListOptions(
      currentTime,
      false,
      {
        currentPage: 0,
        pageSize: 1,
        searchQuery: '',
      },
      undefined,
      groupId,
    ),
  );
  const pastEvents = useEvents(
    getEventListOptions(
      currentTime,
      true,
      {
        currentPage: 0,
        pageSize: 1,
        searchQuery: '',
      },
      undefined,
      groupId,
    ),
  );

  if (group) {
    const props: ComponentProps<typeof GroupProfilePage> = {
      id: group.id,
      active: group.active,
      name: group.name,
      lastModifiedDate: group.lastModifiedDate,
      numberOfTeams: group.teams.length,
      groupTeamsHref: `${
        route({ groupId }).about({}).$
      }#${groupTeamsElementId}`,
      pastEventsCount: pastEvents.total,
      upcomingEventsCount: upcomingEvents.total,
    };

    return (
      <Frame title={group.name}>
        <Switch>
          <Route path={path + route({ groupId }).about.template}>
            <GroupProfilePage {...props}>
              <Frame title="About">
                <About
                  group={group}
                  groupTeamsElementId={groupTeamsElementId}
                />
              </Frame>
            </GroupProfilePage>
          </Route>
          <Route path={path + route({ groupId }).calendar.template}>
            <GroupProfilePage {...props}>
              <Frame title="Calendar">
                <Calendar calendars={group.calendars} />
              </Frame>
            </GroupProfilePage>
          </Route>
          <Route path={path + route({ groupId }).upcoming.template}>
            <GroupProfilePage
              {...props}
              searchQuery={searchQuery}
              onChangeSearchQuery={setSearchQuery}
            >
              <Frame title="Upcoming Events">
                <EventList
                  currentTime={currentTime}
                  searchQuery={debouncedSearchQuery}
                />
              </Frame>
            </GroupProfilePage>
          </Route>
          <Route path={path + route({ groupId }).past.template}>
            <GroupProfilePage
              {...props}
              searchQuery={searchQuery}
              onChangeSearchQuery={setSearchQuery}
            >
              <Frame title="Past Events">
                <EventList
                  past
                  currentTime={currentTime}
                  searchQuery={debouncedSearchQuery}
                />
              </Frame>
            </GroupProfilePage>
          </Route>
          <Redirect to={route({ groupId }).about({}).$} />
        </Switch>
      </Frame>
    );
  }

  return <NotFoundPage />;
};

export default GroupProfile;
