import { ComponentProps, FC, lazy, ReactElement } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import { NoEvents } from '@asap-hub/react-components';
import { events } from '@asap-hub/routing';
import { Frame, SearchFrame } from '@asap-hub/frontend-utils';

import { EventConstraint } from '@asap-hub/model';

const loadEventsList = () =>
  import(/* webpackChunkName: "network-events" */ './EventsEmbedList');

const EventsList = lazy(loadEventsList);

type RequiredPaths = 'about' | 'upcoming' | 'past';
type OptionalPaths =
  | 'calendar'
  | 'outputs'
  | 'workspace'
  | 'draftOutputs'
  | 'compliance';

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
  Compliance?: ReactElement;
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
  Compliance,
}) => (
  <Frame title={displayName}>
    <Routes>
      <Route path={paths.about} element={
        <Frame title="About">{<About />}</Frame>
      } />
      {isActive && Calendar && (
        <Route path={paths.calendar} element={
          <Frame title="Calendar">
            <Calendar />
          </Frame>
        } />
      )}
      {Outputs && (
        <Route path={paths.outputs} element={
          <SearchFrame title="Outputs">{Outputs}</SearchFrame>
        } />
      )}
      {DraftOutputs && (
        <Route path={paths.draftOutputs} element={
          <SearchFrame title="Draft Outputs">{DraftOutputs}</SearchFrame>
        } />
      )}
      {Workspace && (
        <Route path={paths.workspace} element={
          <Frame title="Workspace">
            <Workspace />
          </Frame>
        } />
      )}
      {Compliance && (
        <Route path={paths.compliance} element={
          <SearchFrame title="Compliance">{Compliance}</SearchFrame>
        } />
      )}
      {isActive && (
        <Route path={paths.upcoming} element={
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
        } />
      )}
      <Route path={paths.past} element={
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
      } />
      <Route index element={<Navigate to={paths.about} replace />} />
    </Routes>
  </Frame>
);

export default ProfileSwitch;
