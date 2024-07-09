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
import { gp2 } from '@asap-hub/routing';
import { useTypedParams } from 'react-router-typesafe-routes/dom';
import { FC, lazy, useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
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
  const { userId } = useTypedParams(users.DEFAULT.DETAILS);
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

  const userRoute = users.DEFAULT.$.DETAILS;

  const overview = userRoute.$.OVERVIEW.relativePath;
  const outputs = userRoute.$.OUTPUTS.relativePath;
  const upcoming = userRoute.$.UPCOMING.relativePath;
  const past = userRoute.$.PAST.relativePath;

  const backToUserDetails = users.DEFAULT.DETAILS.buildPath({ userId });
  const userOverviewRoute = userRoute.OVERVIEW.$;
  const editHrefs = {
    editBiographyHref: userOverviewRoute.EDIT_BIOGRAPHY.relativePath,
    editContactInfoHref: userOverviewRoute.EDIT_CONTACT_INFO.relativePath,
    editContributingCohortsHref:
      userOverviewRoute.EDIT_CONTRIBUTING_COHORTS.relativePath,
    editFundingStreamsHref: userOverviewRoute.EDIT_FUNDING_STREAMS.relativePath,
    editTagsHref: userOverviewRoute.EDIT_TAGS.relativePath,
    editQuestionsHref: userOverviewRoute.EDIT_QUESTIONS.relativePath,
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
      <UserDetailPage
        editHref={
          isOwnProfile
            ? userOverviewRoute.EDIT_KEY_INFO.relativePath
            : undefined
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
            path={overview}
            element={
              <Frame title="Overview">
                <UserOverview {...user} {...(isOwnProfile ? editHrefs : {})} />
                {isOwnProfile && (
                  <Routes>
                    <Route
                      path={userOverviewRoute.EDIT_KEY_INFO.relativePath}
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
                      path={userOverviewRoute.EDIT_BIOGRAPHY.relativePath}
                      element={
                        <BiographyModal {...user} {...commonModalProps} />
                      }
                    />
                    <Route
                      path={userOverviewRoute.EDIT_CONTACT_INFO.relativePath}
                      element={
                        <ContactInformationModal
                          {...user}
                          {...commonModalProps}
                          countryCodeSuggestions={countryCodesSuggestions}
                        />
                      }
                    />
                    <Route
                      path={
                        userOverviewRoute.EDIT_CONTRIBUTING_COHORTS.relativePath
                      }
                      element={
                        <ContributingCohortsModal
                          {...user}
                          {...commonModalProps}
                          cohortOptions={cohortOptions}
                        />
                      }
                    />
                    <Route
                      path={userOverviewRoute.EDIT_FUNDING_STREAMS.relativePath}
                      element={
                        <FundingProviderModal {...user} {...commonModalProps} />
                      }
                    />

                    <Route
                      path={userOverviewRoute.EDIT_TAGS.relativePath}
                      element={
                        <TagsModal
                          {...user}
                          {...commonModalProps}
                          suggestions={allTags}
                        />
                      }
                    />
                    <Route
                      path={userOverviewRoute.EDIT_QUESTIONS.relativePath}
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
            path={outputs}
            element={
              <Frame title="Shared Outputs">
                <OutputDirectory userId={userId} />
              </Frame>
            }
          />
          <Route
            path={upcoming}
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
            path={past}
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
          <Route path="*" element={<Navigate to={overview} />} />
        </Routes>
      </UserDetailPage>
    );
  }
  return <NotFoundPage />;
};

export default UserDetail;
