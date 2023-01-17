import {
  OnboardingCoreDetails,
  KeyInformationModal,
  ContactInformationModal,
} from '@asap-hub/gp2-components';
import { NotFoundPage } from '@asap-hub/react-components';
import { ToastContext, useCurrentUserGP2 } from '@asap-hub/react-context';
import { gp2 } from '@asap-hub/routing';
import imageCompression from 'browser-image-compression';
import { useContext } from 'react';
import { Route } from 'react-router-dom';
import { getInstitutions } from '../users/api';
import locationSuggestions from '../users/location-suggestions';
import {
  usePatchUserById,
  usePostUserAvatarById,
  useUserById,
} from '../users/state';

const CoreDetails: React.FC<Record<string, never>> = () => {
  const currentUser = useCurrentUserGP2();

  const toast = useContext(ToastContext);

  const { onboarding } = gp2;
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const userData = useUserById(currentUser!.id);
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const patchUser = usePatchUserById(currentUser!.id);
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const postUserAvatar = usePostUserAvatarById(currentUser!.id);

  const onImageSelect = (file: File) =>
    imageCompression(file, { maxSizeMB: 2 })
      .then((compressedFile) =>
        imageCompression.getDataUrlFromFile(compressedFile),
      )
      .then((encodedFile) => postUserAvatar(encodedFile))
      .catch(() =>
        toast('There was an error and we were unable to save your picture'),
      );

  if (userData) {
    return (
      <>
        <OnboardingCoreDetails {...userData} onImageSelect={onImageSelect} />
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
