import React, { useEffect, ComponentProps, useState, useContext } from 'react';
import {
  Switch,
  Route,
  useRouteMatch,
  Redirect,
  matchPath,
  useLocation,
} from 'react-router-dom';
import { join } from 'path';
import { UserProfilePage, NotFoundPage } from '@asap-hub/react-components';
import { useCurrentUser, ToastContext } from '@asap-hub/react-context';
import imageCompression from 'browser-image-compression';

import { DISCOVER_PATH, NETWORK_PATH } from '@asap-hub/frontend/src/routes';
import { EDIT_PERSONAL_INFO_PATH, EDIT_CONTACT_INFO_PATH } from './routes';
import { TEAMS_PATH } from '../routes';
import { useUserById, usePatchUserAvatarById } from './state';
import Frame from '../../structure/Frame';

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

const User: React.FC<Record<string, never>> = () => {
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
  } = useRouteMatch<{ id: string }>();
  const tab = matchPath<{ tab: string }>(useLocation().pathname, {
    path: `${path}/:tab`,
  })?.params?.tab;

  const user = useUserById(id);
  const currentUser = useCurrentUser();

  const patchUserAvatar = usePatchUserAvatarById(id);
  const [avatarSaving, setAvatarSaving] = useState(false);
  const toast = useContext(ToastContext);

  const isOwnProfile = currentUser?.id === user?.id;

  if (user) {
    const teams = user.teams.map(({ proposal, ...team }) => ({
      ...team,
      href: `${NETWORK_PATH}/${TEAMS_PATH}/${team.id}`,
      proposalHref: proposal ? `/shared-research/${proposal}` : undefined,
    }));

    const profilePageProps: Omit<
      ComponentProps<typeof UserProfilePage>,
      'children'
    > = {
      ...user,
      teams,

      discoverHref: DISCOVER_PATH,

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
      onImageSelect:
        currentUser?.id === id && tab
          ? (file: File) => {
              setAvatarSaving(true);
              return imageCompression(file, { maxSizeMB: 2 })
                .then((compressedFile) =>
                  imageCompression.getDataUrlFromFile(compressedFile),
                )
                .then((encodedFile) => patchUserAvatar(encodedFile))
                .catch(() =>
                  toast(
                    'There was an error and we were unable to save your picture',
                  ),
                )
                .finally(() => setAvatarSaving(false));
            }
          : undefined,
      avatarSaving,
    };

    return (
      <UserProfilePage {...profilePageProps}>
        <Frame>
          {user.role === 'Staff' ? (
            <Staff user={user} teams={teams} />
          ) : (
            <>
              <Switch>
                <Route path={`${path}/research`}>
                  <Research user={user} teams={teams} />
                </Route>
                <Route path={`${path}/about`}>
                  <About user={user} />
                </Route>
                <Route path={`${path}/outputs`}>
                  <Outputs />
                </Route>
                <Redirect to={join(url, 'research')} />
              </Switch>
              {isOwnProfile && (
                <Route path={`${path}/:tab`}>
                  <Editing user={user} />
                </Route>
              )}
            </>
          )}
        </Frame>
      </UserProfilePage>
    );
  }

  return <NotFoundPage />;
};

export default User;
