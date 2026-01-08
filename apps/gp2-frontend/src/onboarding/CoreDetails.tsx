import {
  ContactInformationModal,
  KeyInformationModal,
  OnboardingCoreDetails,
} from '@asap-hub/gp2-components';
import { NotFoundPage } from '@asap-hub/react-components';
import { useCurrentUserGP2 } from '@asap-hub/react-context';
import { gp2 } from '@asap-hub/routing';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { useSelectAvatar } from '../hooks/useSelectAvatar';
import { loadInstitutionOptions } from '@asap-hub/frontend-utils';
import countryCodesSuggestions from '../users/country-codes-suggestions';
import locationSuggestions from '../users/location-suggestions';
import { usePatchUserById, useUserById } from '../users/state';

const CoreDetails: React.FC<Record<string, never>> = () => {
  const currentUser = useCurrentUserGP2();
  const navigate = useNavigate();

  const { onboarding } = gp2;
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const userData = useUserById(currentUser!.id);
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const patchUser = usePatchUserById(currentUser!.id);
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const { avatarSaving, onImageSelect } = useSelectAvatar(currentUser!.id);

  if (userData) {
    return (
      <>
        <OnboardingCoreDetails
          {...userData}
          onImageSelect={onImageSelect}
          avatarSaving={avatarSaving}
        />
        <Routes>
          <Route
            path={onboarding({}).coreDetails({}).editKeyInfo.template}
            element={
              <KeyInformationModal
                {...userData}
                locationSuggestions={locationSuggestions.map(
                  ({ shortName }) => shortName,
                )}
                loadInstitutionOptions={loadInstitutionOptions}
                backHref={onboarding({}).coreDetails({}).$}
                onSave={async (patchedUser) => {
                  await patchUser(patchedUser);
                  navigate(onboarding({}).coreDetails({}).$);
                }}
              />
            }
          />
          <Route
            path={onboarding({}).coreDetails({}).editContactInfo.template}
            element={
              <ContactInformationModal
                {...userData}
                countryCodeSuggestions={countryCodesSuggestions}
                backHref={onboarding({}).coreDetails({}).$}
                onSave={async (patchedUser) => {
                  await patchUser(patchedUser);
                  navigate(onboarding({}).coreDetails({}).$);
                }}
              />
            }
          />
        </Routes>
      </>
    );
  }
  return <NotFoundPage />;
};

export default CoreDetails;
