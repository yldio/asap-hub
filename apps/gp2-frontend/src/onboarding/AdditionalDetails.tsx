import {
  ContributingCohortsModal,
  FundingProviderModal,
  OnboardingAdditionalDetails,
  OpenQuestionsModal,
} from '@asap-hub/gp2-components';
import { NotFoundPage } from '@asap-hub/react-components';
import { useCurrentUserGP2 } from '@asap-hub/react-context';
import { gp2 } from '@asap-hub/routing';
import { Route, Routes } from 'react-router-dom';
import { useContributingCohorts } from '../shared/state';

import { usePatchUserById, useUserById } from '../users/state';

const AdditionalDetails: React.FC<Record<string, never>> = () => {
  const currentUser = useCurrentUserGP2();
  const { onboarding } = gp2;
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const userData = useUserById(currentUser!.id);
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const patchUser = usePatchUserById(currentUser!.id);

  const cohortOptions = useContributingCohorts();
  const additionalDetailsRoute = onboarding({}).additionalDetails({});

  if (userData) {
    return (
      <>
        <OnboardingAdditionalDetails
          {...userData}
          editQuestionsHref={additionalDetailsRoute.editQuestions({}).$}
          editFundingStreamsHref={
            additionalDetailsRoute.editFundingStreams({}).$
          }
          editContributingCohortsHref={
            additionalDetailsRoute.editContributingCohorts({}).$
          }
        />
        <Routes>
          <Route
            path="edit-questions"
            element={
              <OpenQuestionsModal
                {...userData}
                backHref={additionalDetailsRoute.$}
                onSave={(patchedUser) => patchUser(patchedUser)}
              />
            }
          />
          <Route
            path="edit-funding-streams"
            element={
              <FundingProviderModal
                {...userData}
                backHref={additionalDetailsRoute.$}
                onSave={(patchedUser) => patchUser(patchedUser)}
              />
            }
          />
          <Route
            path="edit-contributing-cohorts"
            element={
              <ContributingCohortsModal
                {...userData}
                backHref={additionalDetailsRoute.$}
                onSave={(patchedUser) => patchUser(patchedUser)}
                cohortOptions={cohortOptions}
              />
            }
          />
        </Routes>
      </>
    );
  }
  return <NotFoundPage />;
};

export default AdditionalDetails;
