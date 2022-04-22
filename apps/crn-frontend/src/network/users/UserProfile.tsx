import {
  FC,
  lazy,
  useEffect,
  ComponentProps,
  useState,
  useContext,
} from 'react';
import { Switch, Route, useRouteMatch, Redirect } from 'react-router-dom';
import { UserProfilePage, NotFoundPage } from '@asap-hub/react-components';
import {
  useCurrentUser,
  ToastContext,
  UserProfileContext,
} from '@asap-hub/react-context';
import imageCompression from 'browser-image-compression';
import { network, useRouteParams } from '@asap-hub/routing';
import { Frame } from '@asap-hub/frontend-utils';

import { useUserById, usePatchUserAvatarById } from './state';

import { useCurrentUserProfileTabRoute } from '../../hooks';

const loadResearch = () =>
  import(/* webpackChunkName: "network-profile-research" */ './Research');
const loadAbout = () =>
  import(/* webpackChunkName: "network-profile-about" */ './About');
const loadOutputs = () =>
  import(/* webpackChunkName: "network-profile-outputs" */ './Outputs');
const loadEditing = () =>
  import(/* webpackChunkName: "network-editing" */ './Editing');
const Research = lazy(loadResearch);
const About = lazy(loadAbout);
const Outputs = lazy(loadOutputs);
const Editing = lazy(loadEditing);

const User: FC<Record<string, never>> = () => {
  useEffect(() => {
    loadResearch().then(loadAbout).then(loadOutputs).then(loadEditing);
  }, []);

  const route = network({}).users({}).user;
  const { path } = useRouteMatch();
  const { userId } = useRouteParams(route);

  const tabRoutes = route({ userId });
  const tabRoute = useCurrentUserProfileTabRoute();

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
      <UserProfileContext.Provider value={{ isOwnProfile }}>
        <Frame title={user.displayName}>
          <UserProfilePage {...profilePageProps}>
            {
              <>
                <Switch>
                  <Route path={path + tabRoutes.research.template}>
                    <Frame title="Research">
                      <Research user={user} />
                    </Frame>
                  </Route>
                  <Route path={path + tabRoutes.about.template}>
                    <Frame title="About">
                      <About user={user} />
                    </Frame>
                  </Route>
                  <Route path={path + tabRoutes.outputs.template}>
                    <Frame title="Outputs">
                      <Outputs userId={user?.id} />
                    </Frame>
                  </Route>
                  <Redirect to={tabRoutes.research({}).$} />
                </Switch>
                {isOwnProfile && tabRoute && (
                  <Route path={path + tabRoute.template}>
                    <Editing user={user} backHref={tabRoute({}).$} />
                  </Route>
                )}
              </>
            }
          </UserProfilePage>
        </Frame>
      </UserProfileContext.Provider>
    );
  }

  return <NotFoundPage />;
};

export default User;
