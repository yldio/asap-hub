import { FC, lazy } from 'react';
import { useRouteMatch, Switch, Route, Redirect } from 'react-router-dom';

import { NoEvents } from '@asap-hub/react-components';
import {
  events,
  WorkingGroupRoute,
  GroupRoute,
  TeamRoute,
} from '@asap-hub/routing';
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
  route: WorkingGroupRoute | GroupRoute | TeamRoute;
  ShareOutput?: FC;
  type: 'group' | 'team' | 'working group';
  Workspace?: FC;
};

const RouteFrame = (
  path: string,
  title: string,
  Component?: FC,
  search = false,
) => {
  const ChosenFrame = search ? SearchFrame : Frame;
  return (
    Component && (
      <Route path={path}>
        <ChosenFrame title={title}>
          <Component />
        </ChosenFrame>
      </Route>
    )
  );
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

  const UpcomingEvents = () => (
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
  );

  const PastEvents = () => (
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
  );

  const SwitchFrame = ({ children }: { children: React.ReactNode }) => (
    <Frame title={displayName}>
      <Switch>
        {RouteFrame(path + route.about.template, 'About', About)}
        {children}
        {isActive &&
          RouteFrame(
            path + route.upcoming.template,
            'Upcoming Events',
            UpcomingEvents,
          )}
        {RouteFrame(path + route.past.template, 'Past Events', PastEvents)}
        <Redirect to={route.about({}).$} />
      </Switch>
    </Frame>
  );

  // type narrowing to select TeamRoute
  if ('workspace' in route) {
    return (
      <SwitchFrame>
        {RouteFrame(
          path + route.createOutput.template,
          'Share Output',
          ShareOutput,
        )}
        {RouteFrame(path + route.outputs.template, 'Outputs', Outputs, true)}
        {RouteFrame(path + route.workspace.template, 'Workspace', Workspace)}
      </SwitchFrame>
    );
  }

  // type narrowing to select GroupRoute for now
  if ('calendar' in route) {
    return (
      <SwitchFrame>
        {isActive &&
          RouteFrame(path + route.calendar.template, 'Calendar', Calendar)}
      </SwitchFrame>
    );
  }

  return (
    <SwitchFrame>
      {RouteFrame(
        path + route.createOutput.template,
        'Share Output',
        ShareOutput,
      )}
      {RouteFrame(path + route.outputs.template, 'Outputs', Outputs, true)}
    </SwitchFrame>
  );
};

export default ProfileSwitch;
