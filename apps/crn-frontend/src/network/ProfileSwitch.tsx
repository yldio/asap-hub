import { ComponentProps, FC, lazy, ReactElement } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import { NoEvents } from '@asap-hub/react-components';
import { events } from '@asap-hub/routing';
import { Frame, SearchFrame } from '@asap-hub/frontend-utils';

import { EventConstraint } from '@asap-hub/model';

const loadEventsList = () =>
  import(/* webpackChunkName: "network-events" */ './EventsEmbedList');

const EventsList = lazy(loadEventsList);

type RequiredPaths = 'about' | 'upcoming' | 'past';
type OptionalPaths = 'calendar' | 'outputs' | 'workspace' | 'draftOutputs';

type ProfileSwitchProps = {
  About: FC;
  Calendar?: FC;
  currentTime: Date;
  displayName: string;
  eventConstraint: EventConstraint;
  isActive?: boolean;
  Outputs?: ReactElement;
  DraftOutputs?: ReactElement;
  paths: Record<RequiredPaths, string> & Partial<Record<OptionalPaths, string>>;
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
  paths,
  type,
  Workspace,
  DraftOutputs,
}) => (
  <Frame title={displayName}>
    <Switch>
      <Route path={paths.about}>
        <Frame title="About">{<About />}</Frame>
      </Route>
      {isActive && Calendar && (
        <Route path={paths.calendar}>
          <Frame title="Calendar">
            <Calendar />
          </Frame>
        </Route>
      )}
      {Outputs && (
        <Route path={paths.outputs}>
          <SearchFrame title="Outputs">{Outputs}</SearchFrame>
        </Route>
      )}
      {DraftOutputs && (
        <Route path={paths.draftOutputs}>
          <SearchFrame title="Draft Outputs">{DraftOutputs}</SearchFrame>
        </Route>
      )}
      {Workspace && (
        <Route path={paths.workspace}>
          <Frame title="Workspace">
            <Workspace />
          </Frame>
        </Route>
      )}
      {isActive && (
        <Route path={paths.upcoming}>
          <Frame title="Upcoming Events">
            <EventsList
              constraint={eventConstraint}
              currentTime={currentTime}
              past={false}
              noEventsComponent={
                <NoEvents link={events({}).upcoming({}).$} type={type} />
              }
            />
          </Frame>
        </Route>
      )}
      <Route path={paths.past}>
        <Frame title="Past Events">
          <EventsList
            constraint={eventConstraint}
            currentTime={currentTime}
            past={true}
            noEventsComponent={
              <NoEvents past link={events({}).past({}).$} type={type} />
            }
          />
        </Frame>
      </Route>
      <Redirect to={paths.about} />
    </Switch>
  </Frame>
);

export default ProfileSwitch;
