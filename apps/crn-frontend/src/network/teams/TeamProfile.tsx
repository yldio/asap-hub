import { FC, lazy, useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router';
import { v4 as uuid } from 'uuid';

import { NotFoundPage, TeamProfilePage } from '@asap-hub/react-components';
import { useCurrentUserCRN } from '@asap-hub/react-context';
import { network, useRouteParams } from '@asap-hub/routing';

import { useDismissable } from '../../hooks';

import { useUpcomingAndPastEvents } from '../events';
import ProfileSwitch from '../ProfileSwitch';
import { ASAP_TEAM_NAME } from '../../constants';

import { ManuscriptToastProvider } from './ManuscriptToastProvider';
import { useTeamById } from './state';

const loadAbout = () =>
  import(/* webpackChunkName: "network-team-about" */ './About');
const loadEventsList = () =>
  import(/* webpackChunkName: "network-events" */ '../EventsEmbedList');

const About = lazy(loadAbout);
type TeamProfileProps = {
  currentTime: Date;
};

const TeamProfile: FC<TeamProfileProps> = ({ currentTime }) => {
  const route = network({}).teams({}).team;
  const [teamListElementId] = useState(`team-list-${uuid()}`);
  const { teamId } = useRouteParams(route);
  const team = useTeamById(teamId);
  const user = useCurrentUserCRN();

  const [isProjectBannerDismissed, dismissProjectBanner] = useDismissable(
    'crn-team-project-banner-dismissed',
  );

  const isStaff = user?.role === 'Staff';
  const isAsapTeam = team?.displayName === ASAP_TEAM_NAME;

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    loadAbout().then(loadEventsList);
  }, []);

  const [upcomingEvents, pastEvents] = useUpcomingAndPastEvents(currentTime, {
    teamId,
  });

  if (team) {
    const { about, past, upcoming, workspace } = route({ teamId });
    const paths = {
      about: about.template.replace(/^\//, ''),
      past: past.template.replace(/^\//, ''),
      upcoming: upcoming.template.replace(/^\//, ''),
    };

    return (
      <ManuscriptToastProvider>
        <Routes>
          <Route
            path={workspace.template.replace(/^\//, '')}
            element={<Navigate to={paths.about} replace />}
          />
          <Route
            path="*"
            element={
              <TeamProfilePage
                {...team}
                isStaff={isStaff}
                isAsapTeam={isAsapTeam}
                teamListElementId={teamListElementId}
                upcomingEventsCount={upcomingEvents?.total || 0}
                pastEventsCount={pastEvents?.total || 0}
                showProjectBanner={!isProjectBannerDismissed}
                onDismissProjectBanner={dismissProjectBanner}
              >
                <ProfileSwitch
                  About={() => (
                    <About
                      teamListElementId={teamListElementId}
                      team={team}
                      isAsapTeam={isAsapTeam}
                    />
                  )}
                  currentTime={currentTime}
                  displayName={team.displayName}
                  eventConstraint={{ teamId }}
                  isActive={!team?.inactiveSince}
                  paths={paths}
                  type="team"
                />
              </TeamProfilePage>
            }
          />
        </Routes>
      </ManuscriptToastProvider>
    );
  }

  return <NotFoundPage />;
};

export default TeamProfile;
