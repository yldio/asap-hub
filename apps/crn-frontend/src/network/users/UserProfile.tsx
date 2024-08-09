import { Frame, getEventListOptions } from '@asap-hub/frontend-utils';
import {
  NotFoundPage,
  UserProfilePage,
  NoEvents,
} from '@asap-hub/react-components';
import {
  ToastContext,
  useCurrentUserCRN,
  UserProfileContext,
} from '@asap-hub/react-context';
import { eventRoutes, networkRoutes } from '@asap-hub/routing';
import imageCompression from 'browser-image-compression';
import { ComponentProps, FC, lazy, useContext, useState } from 'react';
import { useTypedParams } from 'react-router-typesafe-routes/dom';
import { Navigate, Route, Routes } from 'react-router-dom';

import { useEvents } from '../../events/state';
import {
  useCurrentUserProfileTabRoute,
  usePaginationParams,
} from '../../hooks';
import { useResearchOutputs } from '../../shared-research/state';
import { usePatchUserAvatarById, useUserById } from './state';

const loadResearch = () =>
  import(/* webpackChunkName: "network-profile-research" */ './Research');
const loadAbout = () =>
  import(/* webpackChunkName: "network-profile-about" */ './About');
const loadOutputs = () =>
  import(/* webpackChunkName: "network-profile-outputs" */ './Outputs');
const loadEditing = () =>
  import(/* webpackChunkName: "network-editing" */ './Editing');
const loadEventsList = () =>
  import(/* webpackChunkName: "network-events" */ '../EventsEmbedList');
const Research = lazy(loadResearch);
const About = lazy(loadAbout);
const Outputs = lazy(loadOutputs);
const Editing = lazy(loadEditing);
const EventsList = lazy(loadEventsList);

type UserProfileProps = {
  currentTime: Date;
};

const UserProfile: FC<UserProfileProps> = ({ currentTime }) => {
  const route = networkRoutes.DEFAULT.USERS.DETAILS;
  const { id: userId } = useTypedParams(networkRoutes.DEFAULT.USERS.DETAILS);

  const tabRoute = useCurrentUserProfileTabRoute();

  const user = useUserById(userId);
  const currentUser = useCurrentUserCRN();

  const patchUserAvatar = usePatchUserAvatarById(userId);
  const [avatarSaving, setAvatarSaving] = useState(false);

  const { pageSize } = usePaginationParams();
  const researchOutputsResult = useResearchOutputs({
    currentPage: 0,
    filters: new Set(),
    pageSize,
    searchQuery: '',
    userId,
  });

  const toast = useContext(ToastContext);

  const isOwnProfile = currentUser?.id === user?.id;
  const isUserOnboarded = currentUser?.onboarded;

  const upcomingEventsResult = useEvents(
    getEventListOptions(currentTime, {
      past: false,
      pageSize,
      constraint: { userId },
    }),
    currentUser,
  );

  const pastEventsResult = useEvents(
    getEventListOptions(currentTime, {
      past: true,
      pageSize,
      constraint: { userId },
    }),
    currentUser,
  );

  if (user) {
    const profilePageProps: Omit<
      ComponentProps<typeof UserProfilePage>,
      'children'
    > = {
      ...user,

      editPersonalInfoHref:
        isOwnProfile && tabRoute
          ? tabRoute.EDIT_PERSONAL_INFO.buildPath({ id: user.id })
          : undefined,
      editContactInfoHref:
        isOwnProfile && tabRoute
          ? tabRoute.EDIT_CONTACT_INFO.buildPath({ id: user.id })
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
      sharedOutputsCount: isUserOnboarded
        ? researchOutputsResult.total
        : undefined,
      upcomingEventsCount: isUserOnboarded
        ? upcomingEventsResult.total
        : undefined,
      pastEventsCount: isUserOnboarded ? pastEventsResult.total : undefined,
    };

    return (
      <UserProfileContext.Provider value={{ isOwnProfile }}>
        <Frame title={user.displayName}>
          <UserProfilePage {...profilePageProps}>
            {
              <>
                <Routes>
                  <Route
                    path={route.$.RESEARCH.relativePath}
                    element={
                      <Frame title="Research">
                        <Research user={user} />
                      </Frame>
                    }
                  />

                  <Route
                    path={route.$.ABOUT.relativePath}
                    element={
                      <Frame title="About">
                        <About user={user} />
                      </Frame>
                    }
                  />
                  <Route
                    path={route.$.OUTPUTS.relativePath}
                    element={
                      <Frame title="Outputs">
                        <Outputs userId={user?.id} />
                      </Frame>
                    }
                  />
                  <Route
                    path={route.$.UPCOMING.relativePath}
                    element={
                      <Frame title="Upcoming Events">
                        <EventsList
                          constraint={{ userId: user?.id }}
                          currentTime={currentTime}
                          past={false}
                          noEventsComponent={
                            <NoEvents
                              link={eventRoutes.DEFAULT.UPCOMING.buildPath({})}
                              type="member"
                            />
                          }
                        />
                      </Frame>
                    }
                  />

                  <Route
                    path={route.$.PAST.relativePath}
                    element={
                      <Frame title="Past Events">
                        <EventsList
                          past
                          constraint={{ userId: user?.id }}
                          currentTime={currentTime}
                          noEventsComponent={
                            <NoEvents
                              past
                              link={eventRoutes.DEFAULT.PAST.buildPath({})}
                              type="member"
                            />
                          }
                        />
                      </Frame>
                    }
                  />
                  <Route
                    path="*"
                    element={
                      <Navigate
                        to={networkRoutes.DEFAULT.USERS.DETAILS.RESEARCH.buildPath(
                          { id: userId },
                        )}
                      />
                    }
                  />
                </Routes>
                {isOwnProfile && tabRoute && (
                  <Route
                    path={tabRoute.path}
                    element={<Editing user={user} backHref={tabRoute.path} />}
                  />
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

export default UserProfile;
