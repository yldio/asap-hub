import { FC, lazy, useState, useEffect, ComponentProps } from 'react';
import { useRouteMatch, Switch, Route, Redirect } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import {
  GroupProfilePage,
  NotFoundPage,
  GroupNoEvents,
  NoEvents,
} from '@asap-hub/react-components';
import { useFlags } from '@asap-hub/react-context';
import { events, network, useRouteParams } from '@asap-hub/routing';
import { Frame } from '@asap-hub/frontend-utils';

import { useGroupById } from './state';
import { usePaginationParams, useSearch } from '../../hooks';
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
const loadEvents = () =>
  import(/* webpackChunkName: "network-events" */ '../EventsEmbed');

const About = lazy(loadAbout);
const Calendar = lazy(loadCalendar);
const EventList = lazy(loadEventList);
const Events = lazy(loadEvents);
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
  const { pageSize } = usePaginationParams();
  const isAlgoliaEventsEnabled = useFlags().isEnabled('EVENTS_SEARCH');

  const upcomingEvents = useEvents(
    getEventListOptions(currentTime, {
      past: false,
      pageSize,
      searchQuery: '',
      constraint: { groupId },
    }),
  );
  const pastEvents = useEvents(
    getEventListOptions(currentTime, {
      past: true,
      pageSize,
      searchQuery: '',
      constraint: { groupId },
    }),
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
                {isAlgoliaEventsEnabled ? (
                  <Events
                    constraint={{ groupId }}
                    currentTime={currentTime}
                    past={false}
                    events={upcomingEvents}
                    noEventsComponent={
                      <NoEvents
                        displayName={group.name}
                        type="group"
                        past={false}
                        link={events({}).upcoming({}).$}
                      />
                    }
                  />
                ) : (
                  <EventList
                    currentTime={currentTime}
                    searchQuery={debouncedSearchQuery}
                    noEventsComponent={
                      <GroupNoEvents
                        past={false}
                        link={events({}).upcoming({}).$}
                      />
                    }
                  />
                )}
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
                {isAlgoliaEventsEnabled ? (
                  <Events
                    events={pastEvents}
                    constraint={{ groupId }}
                    currentTime={currentTime}
                    past={true}
                    noEventsComponent={
                      <NoEvents
                        displayName={group.name}
                        type="group"
                        past={true}
                        link={events({}).past({}).$}
                      />
                    }
                  />
                ) : (
                  <EventList
                    past
                    currentTime={currentTime}
                    searchQuery={debouncedSearchQuery}
                    noEventsComponent={
                      <GroupNoEvents past={true} link={events({}).past({}).$} />
                    }
                  />
                )}
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
