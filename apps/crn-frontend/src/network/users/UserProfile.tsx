import { Frame } from '@asap-hub/frontend-utils';
import {
  EventsSection,
  NotFoundPage,
  UserProfilePage,
} from '@asap-hub/react-components';
import {
  ToastContext,
  useCurrentUser,
  UserProfileContext,
} from '@asap-hub/react-context';
import { network, useRouteParams } from '@asap-hub/routing';
import imageCompression from 'browser-image-compression';
import { ComponentProps, FC, lazy, useContext, useState } from 'react';
import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom';
import { getEventListOptions } from '../../events/options';
import { useEvents } from '../../events/state';
import { useCurrentUserProfileTabRoute, useSearch } from '../../hooks';
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
const loadEvents = () =>
  import(/* webpackChunkName: "network-upcoming-events" */ './Events');
const Research = lazy(loadResearch);
const About = lazy(loadAbout);
const Outputs = lazy(loadOutputs);
const Editing = lazy(loadEditing);
const Events = lazy(loadEvents);
const currentTime = new Date();

const User: FC<Record<string, never>> = () => {
  const route = network({}).users({}).user;
  const { path } = useRouteMatch();
  const { userId } = useRouteParams(route);

  const tabRoutes = route({ userId });
  const tabRoute = useCurrentUserProfileTabRoute();

  const user = useUserById(userId);
  const currentUser = useCurrentUser();

  const patchUserAvatar = usePatchUserAvatarById(userId);
  const [avatarSaving, setAvatarSaving] = useState(false);

  const researchOutputsResult = useResearchOutputs({
    currentPage: 0,
    filters: new Set(),
    pageSize: 1,
    searchQuery: '',
    userId,
  });

  const toast = useContext(ToastContext);

  const isOwnProfile = currentUser?.id === user?.id;

  const upcomingEventsResult = useEvents(
    getEventListOptions(
      currentTime,
      true,
      {
        searchQuery: '',
        currentPage: 0,
        pageSize: 1,
      },
      userId,
    ),
  );

  const { searchQuery, setSearchQuery, debouncedSearchQuery } = useSearch();
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
      sharedOutputsCount: researchOutputsResult.total,
      upcomingEventsCount: upcomingEventsResult.total,
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
                    <EventsSection
                      searchQuery={searchQuery}
                      onChangeSearchQuery={setSearchQuery}
                    >
                      <Frame title="UpcomingEvents">
                        <Events
                          currentTime={currentTime}
                          past={false}
                          searchQuery={debouncedSearchQuery}
                          userId={user?.id}
                        />
                      </Frame>
                    </EventsSection>
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
