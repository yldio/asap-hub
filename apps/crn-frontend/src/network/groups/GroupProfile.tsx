import { FC, lazy, useState, useEffect, ComponentProps } from 'react';
import { useRouteMatch, Switch, Route, Redirect } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import {
  GroupProfilePage,
  NotFoundPage,
  NoEvents,
} from '@asap-hub/react-components';
import { events, network, useRouteParams } from '@asap-hub/routing';
import { Frame } from '@asap-hub/frontend-utils';

import { useGroupById } from './state';
import { usePaginationParams } from '../../hooks';
import { useEvents } from '../../events/state';
import { getEventListOptions } from '../../events/options';

const loadAbout = () =>
  import(/* webpackChunkName: "network-group-about" */ './About');
const loadCalendar = () =>
  import(/* webpackChunkName: "network-group-calendar" */ './Calendar');
const loadEventsList = () =>
  import(/* webpackChunkName: "network-events" */ '../EventsEmbedList');

const About = lazy(loadAbout);
const Calendar = lazy(loadCalendar);
const EventsList = lazy(loadEventsList);
loadAbout();

type GroupProfileProps = {
  currentTime: Date;
};

const GroupProfile: FC<GroupProfileProps> = ({ currentTime }) => {
  useEffect(() => {
    loadAbout().then(loadCalendar).then(loadEventsList);
  }, []);

  const [groupTeamsElementId] = useState(`group-teams-${uuid()}`);

  const route = network({}).groups({}).group;
  const { groupId } = useRouteParams(route);
  const { path } = useRouteMatch();
  const group = useGroupById(groupId);
  const { pageSize } = usePaginationParams();

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

  const isActive = group?.active;
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
          {isActive && (
            <Route path={path + route({ groupId }).calendar.template}>
              <GroupProfilePage {...props}>
                <Frame title="Calendar">
                  <Calendar calendars={group.calendars} />
                </Frame>
              </GroupProfilePage>
            </Route>
          )}
          {isActive && (
            <Route path={path + route({ groupId }).upcoming.template}>
              <GroupProfilePage {...props}>
                <Frame title="Upcoming Events">
                  <EventsList
                    constraint={{ groupId }}
                    currentTime={currentTime}
                    past={false}
                    noEventsComponent={
                      <NoEvents
                        displayName={group.name}
                        link={events({}).upcoming({}).$}
                        type="group"
                      />
                    }
                  />
                </Frame>
              </GroupProfilePage>
            </Route>
          )}
          <Route path={path + route({ groupId }).past.template}>
            <GroupProfilePage {...props}>
              <Frame title="Past Events">
                <EventsList
                  constraint={{ groupId }}
                  currentTime={currentTime}
                  past={true}
                  noEventsComponent={
                    <NoEvents
                      past
                      displayName={group.name}
                      link={events({}).past({}).$}
                      type="group"
                    />
                  }
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
