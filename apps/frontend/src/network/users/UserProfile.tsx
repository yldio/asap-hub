import React, { useEffect, ComponentProps, useState, useContext } from 'react';
import {
  Switch,
  Route,
  useRouteMatch,
  Redirect,
  useLocation,
} from 'react-router-dom';
import { relative } from 'path';
import { UserProfilePage, NotFoundPage } from '@asap-hub/react-components';
import { useCurrentUser, ToastContext } from '@asap-hub/react-context';
import imageCompression from 'browser-image-compression';
import { network, RouteNode, useRouteParams } from '@asap-hub/routing';

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

  const route = network({}).users({}).user;
  const { path } = useRouteMatch();
  const { userId } = useRouteParams(route);
  const { pathname } = useLocation();

  const tabRoutes = route({ userId });
  const tabRoute = ([
    tabRoutes.about,
    tabRoutes.research,
    tabRoutes.outputs,
  ] as ReadonlyArray<
    RouteNode<
      string,
      Record<string, never>,
      {
        editPersonalInfo: typeof tabRoutes.about.children.editPersonalInfo;
        editContactInfo: typeof tabRoutes.about.children.editContactInfo;
      }
    >
  >).find(
    (possibleTabRoute) =>
      !relative(possibleTabRoute({}).$, pathname).startsWith('..'),
  );

  const user = useUserById(userId);
  const currentUser = useCurrentUser();

  const patchUserAvatar = usePatchUserAvatarById(userId);
  const [avatarSaving, setAvatarSaving] = useState(false);
  const toast = useContext(ToastContext);

  const isOwnProfile = currentUser?.id === user?.id;

  if (user) {
    const profilePageProps: Omit<
      ComponentProps<typeof UserProfilePage>,
      'children'
    > = {
      ...user,

      editPersonalInfoHref:
        isOwnProfile && tabRoute
          ? tabRoute({}).editPersonalInfo({}).$
          : undefined,
      editContactInfoHref:
        isOwnProfile && tabRoute
          ? tabRoute({}).editContactInfo({}).$
          : undefined,
      onImageSelect:
        isOwnProfile && tabRoute
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
            <Staff {...user} />
          ) : (
            <>
              <Switch>
                <Route path={path + tabRoutes.research.template}>
                  <Research user={user} />
                </Route>
                <Route path={path + tabRoutes.about.template}>
                  <About user={user} />
                </Route>
                <Route path={path + tabRoutes.outputs.template}>
                  <Outputs />
                </Route>
                <Redirect to={tabRoutes.research({}).$} />
              </Switch>
              {isOwnProfile && tabRoute && (
                <Route path={path + tabRoute.template}>
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
