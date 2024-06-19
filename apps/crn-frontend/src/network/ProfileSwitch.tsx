import { ComponentProps, FC, lazy, ReactElement } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import { NoEvents } from '@asap-hub/react-components';
import { eventRoutes } from '@asap-hub/routing';
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
}) => {
  return (
    <Frame title={displayName}>
      <Routes>
        <Route
          path={paths.about}
          element={<Frame title="About">{<About />}</Frame>}
        />
        {isActive && Calendar && (
          <Route
            path={paths.calendar}
            element={
              <Frame title="Calendar">
                <Calendar />
              </Frame>
            }
          />
        )}
        {Outputs && (
          <Route
            path={paths.outputs}
            element={<SearchFrame title="Outputs">{Outputs}</SearchFrame>}
          />
        )}
        {DraftOutputs && (
          <Route
            path={paths.draftOutputs}
            element={
              <SearchFrame title="Draft Outputs">{DraftOutputs}</SearchFrame>
            }
          />
        )}
        {Workspace && (
          <Route
            path={paths.workspace}
            element={
              <Frame title="Workspace">
                <Workspace />
              </Frame>
            }
          />
        )}
        {isActive && (
          <Route
            path={paths.upcoming}
            element={
              <Frame title="Upcoming Events">
                <EventsList
                  constraint={eventConstraint}
                  currentTime={currentTime}
                  past={false}
                  noEventsComponent={
                    <NoEvents
                      link={eventRoutes.DEFAULT.UPCOMING.path}
                      type={type}
                    />
                  }
                />
              </Frame>
            }
          />
        )}
        <Route
          path={paths.past}
          element={
            <Frame title="Past Events">
              <EventsList
                constraint={eventConstraint}
                currentTime={currentTime}
                past={true}
                noEventsComponent={
                  <NoEvents
                    past
                    link={eventRoutes.DEFAULT.PAST.path}
                    type={type}
                  />
                }
              />
            </Frame>
          }
        />
        <Route path="*" element={<Navigate to={paths.about} />} />
      </Routes>
    </Frame>
  );
};

export default ProfileSwitch;
