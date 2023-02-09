import {
  ContributingCohortsModal,
  ExternalProfilesModal,
  FundingProviderModal,
  OnboardingAdditionalDetails,
  OpenQuestionsModal,
} from '@asap-hub/gp2-components';
import { NotFoundPage } from '@asap-hub/react-components';
import { useCurrentUserGP2 } from '@asap-hub/react-context';
import { gp2 } from '@asap-hub/routing';
import { Route } from 'react-router-dom';

import {
  useContributingCohorts,
  usePatchUserById,
  useUserById,
} from '../users/state';

const AdditionalDetails: React.FC<Record<string, never>> = () => {
  const currentUser = useCurrentUserGP2();
  const { onboarding } = gp2;
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const userData = useUserById(currentUser!.id);
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const patchUser = usePatchUserById(currentUser!.id);

  const cohortOptions = useContributingCohorts();
  if (userData) {
    return (
      <>
        <OnboardingAdditionalDetails
          {...userData}
          editQuestionsHref={
            onboarding({}).additionalDetails({}).editQuestions({}).$
          }
          editFundingStreamsHref={
            onboarding({}).additionalDetails({}).editFundingStreams({}).$
          }
          editContributingCohortsHref={
            onboarding({}).additionalDetails({}).editContributingCohorts({}).$
          }
          editExternalProfilesHref={
            onboarding({}).additionalDetails({}).editExternalProfiles({}).$
          }
        />
        <Route path={onboarding({}).additionalDetails({}).editQuestions({}).$}>
          <OpenQuestionsModal
            {...userData}
            backHref={onboarding({}).additionalDetails({}).$}
            onSave={(patchedUser) => patchUser(patchedUser)}
          />
        </Route>
        <Route
          path={onboarding({}).additionalDetails({}).editFundingStreams({}).$}
        >
          <FundingProviderModal
            {...userData}
            backHref={onboarding({}).additionalDetails({}).$}
            onSave={(patchedUser) => patchUser(patchedUser)}
          />
        </Route>
        <Route
          path={
            onboarding({}).additionalDetails({}).editContributingCohorts({}).$
          }
        >
          <ContributingCohortsModal
            {...userData}
            backHref={onboarding({}).additionalDetails({}).$}
            onSave={(patchedUser) => patchUser(patchedUser)}
            cohortOptions={cohortOptions}
          />
        </Route>
        <Route
          path={onboarding({}).additionalDetails({}).editExternalProfiles({}).$}
        >
          <ExternalProfilesModal
            {...userData}
            backHref={onboarding({}).additionalDetails({}).$}
            onSave={(patchedUser) => patchUser(patchedUser)}
          />
        </Route>
      </>
    );
  }
  return <NotFoundPage />;
};

export default AdditionalDetails;
