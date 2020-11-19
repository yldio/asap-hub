import React, { Suspense, useEffect, ComponentProps } from 'react';
import {
  Switch,
  Route,
  useRouteMatch,
  Redirect,
  matchPath,
  useLocation,
} from 'react-router-dom';
import { join } from 'path';
import {
  Paragraph,
  ProfilePage,
  NotFoundPage,
} from '@asap-hub/react-components';
import { useCurrentUser } from '@asap-hub/react-context';

import { useUserById } from '@asap-hub/frontend/src/api/users';
import ErrorBoundary from '@asap-hub/frontend/src/errors/ErrorBoundary';
import { EDIT_PERSONAL_INFO_PATH, EDIT_CONTACT_INFO_PATH } from './routes';

const loadResearch = () =>
  import(/* webpackChunkName: "network-profile-research" */ './Research');
const loadAbout = () =>
  import(/* webpackChunkName: "network-profile-about" */ './About');
const loadOutputs = () =>
  import(/* webpackChunkName: "network-profile-outputs" */ './Outputs');
const loadStaff = () =>
  import(/* webpackChunkName: "network-profile-staff" */ './Staff');
const loadEditing = () =>
  import(/* webpackChunkName: "network-editing" */ './Editing');
const Research = React.lazy(loadResearch);
const About = React.lazy(loadAbout);
const Outputs = React.lazy(loadOutputs);
const Staff = React.lazy(loadStaff);
const Editing = React.lazy(loadEditing);
loadResearch().then(loadStaff);

const Profile: React.FC<{}> = () => {
  useEffect(() => {
    loadResearch()
      .then(loadStaff)
      .then(loadAbout)
      .then(loadOutputs)
      .then(loadEditing);
  }, []);

  const {
    url,
    path,
    params: { id },
  } = useRouteMatch();
  const tab = matchPath<{ tab: string }>(useLocation().pathname, {
    path: `${path}/:tab`,
  })?.params?.tab;

  const { loading, data: userProfile, patch } = useUserById(id);
  const isOwnProfile = useCurrentUser()?.id === userProfile?.id;

  if (loading) {
    return <Paragraph>Loading...</Paragraph>;
  }

  if (userProfile) {
    const teams = userProfile.teams.map(({ proposal, ...team }) => ({
      ...team,
      href: `/network/teams/${team.id}`,
      proposalHref: proposal ? `/shared-research/${proposal}` : undefined,
    }));

    const profilePageProps: Omit<
      ComponentProps<typeof ProfilePage>,
      'children'
    > = {
      ...userProfile,
      teams,

      discoverHref: '/discover',

      aboutHref: join(url, 'about'),
      researchHref: join(url, 'research'),
      outputsHref: join(url, 'outputs'),

      editPersonalInfoHref:
        isOwnProfile && tab
          ? join(url, tab, EDIT_PERSONAL_INFO_PATH)
          : undefined,
      editContactInfoHref:
        isOwnProfile && tab
          ? join(url, tab, EDIT_CONTACT_INFO_PATH)
          : undefined,
    };

    return (
      <ProfilePage {...profilePageProps}>
        <ErrorBoundary>
          <Suspense fallback="Loading...">
            {userProfile.role === 'Staff' ? (
              <Staff userProfile={userProfile} teams={teams} />
            ) : (
              <>
                <Switch>
                  <Route path={`${path}/research`}>
                    <Research userProfile={userProfile} teams={teams} />
                  </Route>
                  <Route path={`${path}/about`}>
                    <About
                      userProfile={userProfile}
                      onPatchUserProfile={patch}
                    />
                  </Route>
                  <Route path={`${path}/outputs`}>
                    <Outputs />
                  </Route>
                  <Redirect to={join(url, 'research')} />
                </Switch>
                {isOwnProfile && (
                  <Route path={`${path}/:tab`}>
                    <Editing
                      userProfile={userProfile}
                      onPatchUserProfile={patch}
                    />
                  </Route>
                )}
              </>
            )}
          </Suspense>
        </ErrorBoundary>
      </ProfilePage>
    );
  }

  return <NotFoundPage />;
};

export default Profile;
