import { ComponentProps, FC, lazy } from 'react';
import { useRouteMatch, Switch, Route, Redirect } from 'react-router-dom';

import { NoEvents } from '@asap-hub/react-components';
import { events } from '@asap-hub/routing';
import { Frame, SearchFrame } from '@asap-hub/frontend-utils';

import { EventConstraint } from '@asap-hub/model';

const loadEventsList = () =>
  import(/* webpackChunkName: "network-events" */ './EventsEmbedList');

const EventsList = lazy(loadEventsList);

type ProfileSwitchProps = {
  About: FC;
  Calendar?: FC;
  currentTime: Date;
  displayName: string;
  eventConstraint: EventConstraint;
  isActive?: boolean;
  Outputs?: FC;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  route: any;
  ShareOutput?: FC;
  type: ComponentProps<typeof NoEvents>['type'];
  Workspace?: FC;
};

const ProfileSwitch: FC<ProfileSwitchProps> = ({
  About,
  Calendar,
  currentTime,
  displayName,
  eventConstraint,
  isActive,
  Outputs,
  route,
  ShareOutput,
  type,
  Workspace,
}) => {
  const { path } = useRouteMatch();

  return (
    <Frame title={displayName}>
      <Switch>
        {ShareOutput && (
          <Route path={path + route.createOutput.template}>
            <Frame title="Share Output">
              <ShareOutput />
            </Frame>
          </Route>
        )}
        <Route path={path + route.about.template}>
          <Frame title="About">{<About />}</Frame>
        </Route>
        {isActive && Calendar && (
          <Route path={path + route.calendar.template}>
            <Frame title="Calendar">
              <Calendar />
            </Frame>
          </Route>
        )}
        {Outputs && (
          <Route path={path + route.outputs.template}>
            <SearchFrame title="Outputs">
              <Outputs />
            </SearchFrame>
          </Route>
        )}
        {Workspace && (
          <Route path={path + route.workspace.template}>
            <Frame title="Workspace">
              <Workspace />
            </Frame>
          </Route>
        )}
        {isActive && (
          <Route path={path + route.upcoming.template}>
            <Frame title="Upcoming Events">
              <EventsList
                constraint={eventConstraint}
                currentTime={currentTime}
                past={false}
                noEventsComponent={
                  <NoEvents
                    displayName={displayName}
                    link={events({}).upcoming({}).$}
                    type={type}
                  />
                }
              />
            </Frame>
          </Route>
        )}
        <Route path={path + route.past.template}>
          <Frame title="Past Events">
            <EventsList
              constraint={eventConstraint}
              currentTime={currentTime}
              past={true}
              noEventsComponent={
                <NoEvents
                  past
                  displayName={displayName}
                  link={events({}).past({}).$}
                  type={type}
                />
              }
            />
          </Frame>
        </Route>
        <Redirect to={route.about({}).$} />
      </Switch>
    </Frame>
  );
};

export default ProfileSwitch;
