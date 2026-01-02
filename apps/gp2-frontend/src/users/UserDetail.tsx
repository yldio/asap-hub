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
import { FC, lazy, useEffect, useMemo } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();

  const commonModalProps = {
    backHref: backToUserDetails,
    onSave: async (patchedUser: UserPatchRequest) => {
      await patchUser(patchedUser);
      // TODO: This is a quickfix implemented to prevent https://asaphub.atlassian.net/browse/ASAP-1318
      // Ideally, the EditModal component in react-component should be able to navigate to `backHref`
      // but GP2 unmounts the whole app when the user's data is refreshed, causing the form to be unmounted
      // when it needs to perform the navigation.
      // So, this is a workaround that forces the navigation immediately after saving.
      navigate(backToUserDetails);
    },
  };

  // Memoize constraint to prevent new object reference on every render
  const constraint = useMemo(() => ({ userId }), [userId]);

  const [upcomingEvents, pastEvents] = useUpcomingAndPastEvents(
    currentTime,
    constraint,
  );

  if (user) {
    return (
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
          <Route
            path="overview/*"
            element={
              <Frame title="Overview">
                <UserOverview {...user} {...(isOwnProfile ? editHrefs : {})} />
                {isOwnProfile && (
                  <Routes>
                    <Route
                      path="edit-key-info"
                      element={
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
                      }
                    />
                    <Route
                      path="edit-biography"
                      element={
                        <BiographyModal {...user} {...commonModalProps} />
                      }
                    />
                    <Route
                      path="edit-contact-info"
                      element={
                        <ContactInformationModal
                          {...user}
                          {...commonModalProps}
                          countryCodeSuggestions={countryCodesSuggestions}
                        />
                      }
                    />
                    <Route
                      path="edit-contributing-cohorts"
                      element={
                        <ContributingCohortsModal
                          {...user}
                          {...commonModalProps}
                          cohortOptions={cohortOptions}
                        />
                      }
                    />
                    <Route
                      path="edit-funding-streams"
                      element={
                        <FundingProviderModal {...user} {...commonModalProps} />
                      }
                    />
                    <Route
                      path="edit-tags"
                      element={
                        <TagsModal
                          {...user}
                          {...commonModalProps}
                          suggestions={allTags}
                        />
                      }
                    />
                    <Route
                      path="edit-questions"
                      element={
                        <OpenQuestionsModal {...user} {...commonModalProps} />
                      }
                    />
                  </Routes>
                )}
              </Frame>
            }
          />
          <Route
            path="outputs"
            element={
              <Frame title="Shared Outputs">
                <OutputDirectory userId={userId} />
              </Frame>
            }
          />
          <Route
            path="upcoming"
            element={
              <Frame title="Upcoming Events">
                <EventsList
                  constraint={{ userId }}
                  currentTime={currentTime}
                  past={false}
                />
              </Frame>
            }
          />
          <Route
            path="past"
            element={
              <Frame title="Past Events">
                <EventsList
                  currentTime={currentTime}
                  past={true}
                  constraint={{ userId }}
                />
              </Frame>
            }
          />
          <Route index element={<Navigate to="overview" replace />} />
        </Routes>
      </UserDetailPage>
    );
  }
  return <NotFoundPage />;
};

export default UserDetail;
