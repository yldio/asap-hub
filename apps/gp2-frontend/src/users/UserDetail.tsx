import { Frame } from '@asap-hub/frontend-utils';
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
import { UserPatchRequest } from '@asap-hub/model';
import { NotFoundPage } from '@asap-hub/react-components';
import { useCurrentUserGP2 } from '@asap-hub/react-context';
import { gp2, useRouteParams } from '@asap-hub/routing';
import { Redirect, Route, Switch } from 'react-router-dom';
import OutputList from '../outputs/OutputList';
import { useOutputs } from '../outputs/state';
import { getInstitutions } from './api';
import locationSuggestions from './location-suggestions';
import { useContributingCohorts, usePatchUserById, useUserById } from './state';

const { users } = gp2;

const UserDetail = () => {
  const currentUser = useCurrentUserGP2();
  const { userId } = useRouteParams(users({}).user);
  const isOwnProfile = userId === currentUser?.id;
  const user = useUserById(userId);

  const { total } = useOutputs({
    filter: { authors: [userId] },
  });

  const userRoute = users({}).user({ userId });

  const overview = userRoute.overview({}).$;
  const outputs = userRoute.outputs({}).$;

  const backToUserDetails = users({}).user({ userId }).$;
  const userOverviewRoute = userRoute.overview({});
  const editHrefs = {
    editBiographyHref: userOverviewRoute.editBiography({}).$,
    editContactInfoHref: userOverviewRoute.editContactInfo({}).$,
    editContributingCohortsHref: userOverviewRoute.editContributingCohorts({})
      .$,
    editExternalProfilesHref: userOverviewRoute.editExternalProfiles({}).$,
    editFundingStreamsHref: userOverviewRoute.editFundingStreams({}).$,
    editKeywordsHref: userOverviewRoute.editKeywords({}).$,
    editQuestionsHref: userOverviewRoute.editQuestions({}).$,
  };
  const cohortOptions = useContributingCohorts();
  const patchUser = usePatchUserById(userId);

  const commonModalProps = {
    backHref: backToUserDetails,
    onSave: (patchedUser: UserPatchRequest) => patchUser(patchedUser),
  };

  if (user) {
    return (
      <Switch>
        <UserDetailPage
          editHref={
            isOwnProfile ? userOverviewRoute.editKeyInfo({}).$ : undefined
          }
          outputsTotal={total}
          {...user}
        >
          <Switch>
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
                    <Route path={userOverviewRoute.editExternalProfiles({}).$}>
                      <ExternalProfilesModal {...user} {...commonModalProps} />
                    </Route>
                    <Route path={userOverviewRoute.editFundingStreams({}).$}>
                      <FundingProviderModal {...user} {...commonModalProps} />
                    </Route>
                    <Route path={userOverviewRoute.editKeywords({}).$}>
                      <KeywordsModal {...user} {...commonModalProps} />
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
                <OutputList filters={{ authors: [userId] }} />
              </Frame>
            </Route>
            <Redirect to={overview} />
          </Switch>
        </UserDetailPage>
      </Switch>
    );
  }
  return <NotFoundPage />;
};

export default UserDetail;
