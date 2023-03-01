import { gp2, useRouteParams } from '@asap-hub/routing';

import {
  BiographyModal,
  ContactInformationModal,
  ContributingCohortsModal,
  ExternalProfilesModal,
  FundingProviderModal,
  KeyInformationModal,
  KeywordsModal,
  OpenQuestionsModal,
  UserDetailPage,
  UserOverview,
} from '@asap-hub/gp2-components';
import { NotFoundPage } from '@asap-hub/react-components';

import { UserPatchRequest } from '@asap-hub/model';
import { useCurrentUserGP2 } from '@asap-hub/react-context';
import { Route } from 'react-router-dom';
import { getInstitutions } from './api';
import locationSuggestions from './location-suggestions';
import { useContributingCohorts, usePatchUserById, useUserById } from './state';

const { users } = gp2;

const UserDetail = () => {
  const currentUser = useCurrentUserGP2();
  const { userId } = useRouteParams(users({}).user);
  const isOwnProfile = userId === currentUser?.id;
  const user = useUserById(userId);

  const backToUserDetails = users({}).user({ userId }).$;
  const editHrefs = {
    editBiographyHref: users({}).user({ userId }).editBiography({}).$,
    editContactInfoHref: users({}).user({ userId }).editContactInfo({}).$,
    editContributingCohortsHref: users({})
      .user({ userId })
      .editContributingCohorts({}).$,
    editExternalProfilesHref: users({})
      .user({ userId })
      .editExternalProfiles({}).$,
    editFundingStreamsHref: users({}).user({ userId }).editFundingStreams({}).$,
    editKeywordsHref: users({}).user({ userId }).editKeywords({}).$,
    editQuestionsHref: users({}).user({ userId }).editQuestions({}).$,
  };
  const cohortOptions = useContributingCohorts();
  const patchUser = usePatchUserById(userId);

  const commonModalProps = {
    backHref: backToUserDetails,
    onSave: (patchedUser: UserPatchRequest) => patchUser(patchedUser),
  };

  if (user) {
    return (
      <UserDetailPage
        editHref={
          isOwnProfile
            ? users({}).user({ userId }).editKeyInfo({}).$
            : undefined
        }
        {...user}
      >
        <UserOverview {...user} {...(isOwnProfile ? editHrefs : {})} />
        {isOwnProfile && (
          <>
            <Route path={users({}).user({ userId }).editKeyInfo({}).$}>
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
            <Route path={users({}).user({ userId }).editBiography({}).$}>
              <BiographyModal {...user} {...commonModalProps} />
            </Route>
            <Route path={users({}).user({ userId }).editContactInfo({}).$}>
              <ContactInformationModal {...user} {...commonModalProps} />
            </Route>
            <Route
              path={users({}).user({ userId }).editContributingCohorts({}).$}
            >
              <ContributingCohortsModal
                {...user}
                {...commonModalProps}
                cohortOptions={cohortOptions}
              />
            </Route>
            <Route path={users({}).user({ userId }).editExternalProfiles({}).$}>
              <ExternalProfilesModal {...user} {...commonModalProps} />
            </Route>
            <Route path={users({}).user({ userId }).editFundingStreams({}).$}>
              <FundingProviderModal {...user} {...commonModalProps} />
            </Route>
            <Route path={users({}).user({ userId }).editKeywords({}).$}>
              <KeywordsModal {...user} {...commonModalProps} />
            </Route>
            <Route path={users({}).user({ userId }).editQuestions({}).$}>
              <OpenQuestionsModal {...user} {...commonModalProps} />
            </Route>
          </>
        )}
      </UserDetailPage>
    );
  }
  return <NotFoundPage />;
};

export default UserDetail;
