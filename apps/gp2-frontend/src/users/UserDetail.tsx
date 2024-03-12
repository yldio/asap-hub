import {
  BiographyModal,
  ContactInformationModal,
  ContributingCohortsModal,
  FundingProviderModal,
  KeyInformationModal,
  OpenQuestionsModal,
  TagsModal,
  UserDetailPage,
  UserOverview,
} from '@asap-hub/gp2-components';
import { UserPatchRequest } from '@asap-hub/model';
import { NotFoundPage } from '@asap-hub/react-components';
import { useCurrentUserGP2 } from '@asap-hub/react-context';
import { gp2, useRouteParams } from '@asap-hub/routing';
import { FC, lazy, useEffect } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import EventsList from '../events/EventsList';
import { useUpcomingAndPastEvents } from '../events/state';
import Frame from '../Frame';
import { usePaginationParams } from '../hooks';
import { useSelectAvatar } from '../hooks/useSelectAvatar';
import { useOutputs } from '../outputs/state';
import { useContributingCohorts, useTags } from '../shared/state';
import { getInstitutions } from './api';
import countryCodesSuggestions from './country-codes-suggestions';
import locationSuggestions from './location-suggestions';
import { usePatchUserById, useUserById } from './state';

const { users } = gp2;
type UserDetailProps = {
  currentTime: Date;
};
const loadOutputDirectory = () =>
  import(
    /* webpackChunkName: "user-output-directory" */ '../outputs/OutputDirectory'
  );
const OutputDirectory = lazy(loadOutputDirectory);

const UserDetail: FC<UserDetailProps> = ({ currentTime }) => {
  const currentUser = useCurrentUserGP2();
  const { userId } = useRouteParams(users({}).user);
  const isOwnProfile = userId === currentUser?.id;
  const user = useUserById(userId);
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    loadOutputDirectory();
  }, [user]);
  const { pageSize } = usePaginationParams();

  const { total: outputsTotal } = useOutputs({
    currentPage: 0,
    filters: new Set(),
    pageSize,
    searchQuery: '',
    authorId: userId,
  });

  const userRoute = users({}).user({ userId });

  const overview = userRoute.overview({}).$;
  const outputs = userRoute.outputs({}).$;
  const upcoming = userRoute.upcoming({}).$;
  const past = userRoute.past({}).$;

  const backToUserDetails = users({}).user({ userId }).$;
  const userOverviewRoute = userRoute.overview({});
  const editHrefs = {
    editBiographyHref: userOverviewRoute.editBiography({}).$,
    editContactInfoHref: userOverviewRoute.editContactInfo({}).$,
    editContributingCohortsHref: userOverviewRoute.editContributingCohorts({})
      .$,
    editFundingStreamsHref: userOverviewRoute.editFundingStreams({}).$,
    editTagsHref: userOverviewRoute.editTags({}).$,
    editQuestionsHref: userOverviewRoute.editQuestions({}).$,
  };
  const cohortOptions = useContributingCohorts();
  const patchUser = usePatchUserById(userId);
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const { avatarSaving, onImageSelect } = useSelectAvatar(currentUser!.id);

  const { items: allTags } = useTags();

  const commonModalProps = {
    backHref: backToUserDetails,
    onSave: (patchedUser: UserPatchRequest) => patchUser(patchedUser),
  };
  const [upcomingEvents, pastEvents] = useUpcomingAndPastEvents(currentTime, {
    userId,
  });

  if (user) {
    return (
      <Routes>
        <UserDetailPage
          editHref={
            isOwnProfile ? userOverviewRoute.editKeyInfo({}).$ : undefined
          }
          outputsTotal={outputsTotal}
          upcomingTotal={upcomingEvents?.total || 0}
          pastTotal={pastEvents?.total || 0}
          avatarSaving={avatarSaving}
          onImageSelect={isOwnProfile ? onImageSelect : undefined}
          {...user}
        >
          <Routes>
            <Route path={overview}>
              <Frame title="Overview">
                <UserOverview {...user} {...(isOwnProfile ? editHrefs : {})} />
                {isOwnProfile && (
                  <>
                    <Route path={userOverviewRoute.editKeyInfo({}).$}>
                      <KeyInformationModal
                        {...user}
                        {...commonModalProps}
                        locationSuggestions={locationSuggestions.map(
                          ({ shortName }) => shortName,
                        )}
                        loadInstitutionOptions={(searchQuery) =>
                          getInstitutions({ searchQuery }).then((data) =>
                            data.items.map(({ name }) => name),
                          )
                        }
                      />
                    </Route>
                    <Route path={userOverviewRoute.editBiography({}).$}>
                      <BiographyModal {...user} {...commonModalProps} />
                    </Route>
                    <Route path={userOverviewRoute.editContactInfo({}).$}>
                      <ContactInformationModal
                        {...user}
                        {...commonModalProps}
                        countryCodeSuggestions={countryCodesSuggestions}
                      />
                    </Route>
                    <Route
                      path={userOverviewRoute.editContributingCohorts({}).$}
                    >
                      <ContributingCohortsModal
                        {...user}
                        {...commonModalProps}
                        cohortOptions={cohortOptions}
                      />
                    </Route>
                    <Route path={userOverviewRoute.editFundingStreams({}).$}>
                      <FundingProviderModal {...user} {...commonModalProps} />
                    </Route>
                    <Route path={userOverviewRoute.editTags({}).$}>
                      <TagsModal
                        {...user}
                        {...commonModalProps}
                        suggestions={allTags}
                      />
                    </Route>
                    <Route path={userOverviewRoute.editQuestions({}).$}>
                      <OpenQuestionsModal {...user} {...commonModalProps} />
                    </Route>
                  </>
                )}
              </Frame>
            </Route>
            <Route path={outputs}>
              <Frame title="Shared Outputs">
                <OutputDirectory userId={userId} />
              </Frame>
            </Route>
            <Route path={upcoming}>
              <Frame title="Upcoming Events">
                <EventsList
                  constraint={{ userId }}
                  currentTime={currentTime}
                  past={false}
                />
              </Frame>
            </Route>
            <Route path={past}>
              <Frame title="Past Events">
                <EventsList
                  currentTime={currentTime}
                  past={true}
                  constraint={{ userId }}
                />
              </Frame>
            </Route>
            <Redirect to={overview} />
          </Routes>
        </UserDetailPage>
      </Routes>
    );
  }
  return <NotFoundPage />;
};

export default UserDetail;
