import { FC, lazy, useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router';
import { v4 as uuid } from 'uuid';

import { NotFoundPage, TeamProfilePage } from '@asap-hub/react-components';
import { useCurrentUserCRN } from '@asap-hub/react-context';
import { network, useRouteParams } from '@asap-hub/routing';

import { useDismissable, usePaginationParams } from '../../hooks';

import { useUpcomingAndPastEvents } from '../events';
import ProfileSwitch from '../ProfileSwitch';

import { ManuscriptToastProvider } from './ManuscriptToastProvider';
import { useManuscripts, useTeamById } from './state';

const loadAbout = () =>
  import(/* webpackChunkName: "network-team-about" */ './About');
const loadCompliance = () =>
  import(/* webpackChunkName: "network-team-compliance" */ './Compliance');
const loadEventsList = () =>
  import(/* webpackChunkName: "network-events" */ '../EventsEmbedList');

const About = lazy(loadAbout);
const Compliance = lazy(loadCompliance);
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
  const isAsapTeam = team?.displayName === 'ASAP';
  const canDisplayCompliancePage = isStaff && isAsapTeam;

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    loadAbout()
      .then(canDisplayCompliancePage ? loadCompliance : undefined)
      .then(loadEventsList);
  }, [canDisplayCompliancePage]);

  const [upcomingEvents, pastEvents] = useUpcomingAndPastEvents(currentTime, {
    teamId,
  });

  const { pageSize } = usePaginationParams();

  const manuscriptCount = useManuscripts({
    searchQuery: '',
    currentPage: 0,
    pageSize,
    requestedAPCCoverage: 'all',
    completedStatus: 'hide',
    selectedStatuses: [],
  });

  if (team) {
    const { about, compliance, past, upcoming, workspace } = route({ teamId });
    const paths = {
      about: about.template.replace(/^\//, ''),
      compliance: compliance.template.replace(/^\//, ''),
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
                manuscriptsCount={manuscriptCount.total || 0}
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
                  {...(canDisplayCompliancePage
                    ? { Compliance: <Compliance /> }
                    : {})}
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
