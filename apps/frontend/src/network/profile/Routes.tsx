import React, { Suspense, useEffect, ComponentProps } from 'react';
import {
  Switch,
  Route,
  useRouteMatch,
  Redirect,
  matchPath,
  useLocation,
  useHistory,
} from 'react-router-dom';
import { join } from 'path';
import {
  Paragraph,
  ProfilePage,
  NotFoundPage,
  PersonalInfoModal,
} from '@asap-hub/react-components';
import { useCurrentUser } from '@asap-hub/react-context';

import { useUserById } from '@asap-hub/frontend/src/api/users';
import ErrorBoundary from '@asap-hub/frontend/src/errors/ErrorBoundary';

const loadResearch = () =>
  import(/* webpackChunkName: "network-profile-research" */ './Research');
const loadAbout = () =>
  import(/* webpackChunkName: "network-profile-about" */ './About');
const loadOutputs = () =>
  import(/* webpackChunkName: "network-profile-outputs" */ './Outputs');
const loadStaff = () =>
  import(/* webpackChunkName: "network-profile-staff" */ './Staff');
const Research = React.lazy(loadResearch);
const About = React.lazy(loadAbout);
const Outputs = React.lazy(loadOutputs);
const Staff = React.lazy(loadStaff);
loadResearch().then(loadStaff);

const Profile: React.FC<{}> = () => {
  useEffect(() => {
    loadResearch().then(loadStaff).then(loadAbout).then(loadOutputs);
  }, []);

  const currentUser = useCurrentUser();
  const {
    url,
    path,
    params: { id },
  } = useRouteMatch();
  const tab = matchPath<{ tab: string }>(useLocation().pathname, {
    path: `${path}/:tab`,
  })?.params?.tab;

  const { loading, data: profile, patch } = useUserById(id);
  const history = useHistory();

  if (loading) {
    return <Paragraph>Loading...</Paragraph>;
  }

  if (profile) {
    const teams = profile.teams.map(({ proposal, ...team }) => ({
      ...team,
      href: `/network/teams/${team.id}`,
      proposalHref: proposal ? `/shared-research/${proposal}` : undefined,
    }));

    const profilePageProps: Omit<
      ComponentProps<typeof ProfilePage>,
      'children'
    > = {
      ...profile,
      teams,

      discoverHref: '/discover',

      aboutHref: join(url, 'about'),
      researchHref: join(url, 'research'),
      outputsHref: join(url, 'outputs'),

      editPersonalInfoHref:
        currentUser?.id === id && tab
          ? join(url, tab, '/edit-personal-info')
          : undefined,
      editContactHref:
        currentUser?.id === id && tab
          ? join(url, tab, '/edit-contact')
          : undefined,
    };

    return (
      <ProfilePage {...profilePageProps}>
        <ErrorBoundary>
          <Suspense fallback="Loading...">
            {profile.role === 'Staff' ? (
              <>
                <Staff userProfile={profile} teams={teams} />
                {currentUser?.id === id && (
                  <Route path={join(path, 'edit-personal-info')}>
                    <PersonalInfoModal
                      {...profile}
                      backHref={url}
                      onSave={async (data) => {
                        await patch(data);
                        history.push(url);
                      }}
                    />
                  </Route>
                )}
              </>
            ) : (
              <>
                <Switch>
                  <Route path={`${path}/research`}>
                    <Research userProfile={profile} teams={teams} />
                  </Route>
                  <Route path={`${path}/about`}>
                    <About userProfile={profile} onPatchUserProfile={patch} />
                  </Route>
                  <Route path={`${path}/outputs`}>
                    <Outputs />
                  </Route>
                  <Redirect to={join(url, 'research')} />
                </Switch>
                {currentUser?.id === id && tab && (
                  <Route path={join(path, tab, 'edit-personal-info')}>
                    <PersonalInfoModal
                      {...profile}
                      backHref={join(url, tab)}
                      onSave={async (data) => {
                        await patch(data);
                        history.push(join(url, tab));
                      }}
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
