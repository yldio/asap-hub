import {
  ContactInformationModal,
  KeyInformationModal,
  OnboardingCoreDetails,
} from '@asap-hub/gp2-components';
import { NotFoundPage } from '@asap-hub/react-components';
import { useCurrentUserGP2 } from '@asap-hub/react-context';
import { gp2 } from '@asap-hub/routing';
import { Route } from 'react-router-dom';
import { useSelectAvatar } from '../hooks/useSelectAvatar';
import { getInstitutions } from '../users/api';
import locationSuggestions from '../users/location-suggestions';
import { usePatchUserById, useUserById } from '../users/state';

const CoreDetails: React.FC<Record<string, never>> = () => {
  const currentUser = useCurrentUserGP2();

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
        <Route path={onboarding({}).coreDetails({}).editKeyInfo({}).$}>
          <KeyInformationModal
            {...userData}
            locationSuggestions={locationSuggestions.map(
              ({ shortName }) => shortName,
            )}
            loadInstitutionOptions={(searchQuery) =>
              getInstitutions({ searchQuery }).then((data) =>
                data.items.map(({ name }) => name),
              )
            }
            backHref={onboarding({}).coreDetails({}).$}
            onSave={(patchedUser) => patchUser(patchedUser)}
          />
        </Route>
        <Route path={onboarding({}).coreDetails({}).editContactInfo({}).$}>
          <ContactInformationModal
            {...userData}
            backHref={onboarding({}).coreDetails({}).$}
            onSave={(patchedUser) => patchUser(patchedUser)}
          />
        </Route>
      </>
    );
  }
  return <NotFoundPage />;
};

export default CoreDetails;
