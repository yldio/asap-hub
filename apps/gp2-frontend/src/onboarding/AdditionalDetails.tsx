import { OnboardingAdditionalDetails } from '@asap-hub/gp2-components';
import { NotFoundPage } from '@asap-hub/react-components';
import { useCurrentUserGP2 } from '@asap-hub/react-context';
import { gp2 } from '@asap-hub/routing';
import { Route } from 'react-router-dom';

import { useUserById } from '../users/state';

const AdditionalDetails: React.FC<Record<string, never>> = () => {
  const currentUser = useCurrentUserGP2();
  const { onboarding } = gp2;
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const userData = useUserById(currentUser!.id);

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
            onboarding({}).additionalDetails({}).editFundingStreams({}).$
          }
          editExternalProfilesHref={
            onboarding({}).additionalDetails({}).editExternalProfiles({}).$
          }
        />
        <Route path={onboarding({}).additionalDetails({}).editQuestions({}).$}>
          {/* { edit Questions Modal} */}
        </Route>
        <Route
          path={onboarding({}).additionalDetails({}).editFundingStreams({}).$}
        >
          {/* { edit Funding Streams Modal} */}
        </Route>
        <Route
          path={
            onboarding({}).additionalDetails({}).editContributingCohorts({}).$
          }
        >
          {/* { edit Contributing Cohorts Modal} */}
        </Route>
        <Route
          path={onboarding({}).additionalDetails({}).editExternalProfiles({}).$}
        >
          {/* { edit External Profiles Modal} */}
        </Route>
      </>
    );
  }
  return <NotFoundPage />;
};

export default AdditionalDetails;
