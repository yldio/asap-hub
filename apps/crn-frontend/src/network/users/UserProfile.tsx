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
import { events, network, useRouteParams } from '@asap-hub/routing';
import imageCompression from 'browser-image-compression';
import { ComponentProps, FC, lazy, useContext, useState } from 'react';
import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom';

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
  const route = network({}).users({}).user;
  const { path } = useRouteMatch();
  const { userId } = useRouteParams(route);

  const tabRoutes = route({ userId });
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
                  <Route path={path + tabRoutes.upcoming.template}>
                    <Frame title="Upcoming Events">
                      <EventsList
                        constraint={{ userId: user?.id }}
                        currentTime={currentTime}
                        past={false}
                        noEventsComponent={
                          <NoEvents
                            link={events({}).upcoming({}).$}
                            type="member"
                          />
                        }
                      />
                    </Frame>
                  </Route>
                  <Route path={path + tabRoutes.past.template}>
                    <Frame title="Past Events">
                      <EventsList
                        past
                        constraint={{ userId: user?.id }}
                        currentTime={currentTime}
                        noEventsComponent={
                          <NoEvents
                            past
                            link={events({}).past({}).$}
                            type="member"
                          />
                        }
                      />
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

export default UserProfile;
