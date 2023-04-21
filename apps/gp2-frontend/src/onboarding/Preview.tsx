import {
  BiographyModal,
  ContactInformationModal,
  ContributingCohortsModal,
  ExternalProfilesModal,
  FundingProviderModal,
  KeyInformationModal,
  KeywordsModal,
  OnboardingPreview,
  OpenQuestionsModal,
} from '@asap-hub/gp2-components';
import { gp2 as gp2Model } from '@asap-hub/model';
import { NotFoundPage } from '@asap-hub/react-components';
import { useCurrentUserGP2 } from '@asap-hub/react-context';
import { gp2 as gp2Routing } from '@asap-hub/routing';
import { Route } from 'react-router-dom';
import { useSelectAvatar } from '../hooks/useSelectAvatar';
import { getInstitutions } from '../users/api';
import countryCodesSuggestions from '../users/country-codes-suggestions';
import locationSuggestions from '../users/location-suggestions';

import {
  useContributingCohorts,
  usePatchUserById,
  useUserById,
} from '../users/state';

const Preview: React.FC<Record<string, never>> = () => {
  const currentUser = useCurrentUserGP2();
  const { onboarding } = gp2Routing;
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const userData = useUserById(currentUser!.id);
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const patchUser = usePatchUserById(currentUser!.id);
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const { avatarSaving, onImageSelect } = useSelectAvatar(currentUser!.id);

  const commonModalProps = {
    backHref: onboarding({}).preview({}).$,
    onSave: (patchedUser: gp2Model.UserPatchRequest) => patchUser(patchedUser),
  };
  const {
    editKeyInfo,
    editContactInfo,
    editBiography,
    editKeywords,
    editQuestions,
    editFundingStreams,
    editContributingCohorts,
    editExternalProfiles,
  } = onboarding({}).preview({});

  const cohortOptions = useContributingCohorts();
  if (userData) {
    return (
      <>
        <OnboardingPreview
          {...userData}
          onImageSelect={onImageSelect}
          avatarSaving={avatarSaving}
          editKeyInfoHref={editKeyInfo({}).$}
          editContactInfoHref={editContactInfo({}).$}
          editBiographyHref={editBiography({}).$}
          editKeywordsHref={editKeywords({}).$}
          editQuestionsHref={editQuestions({}).$}
          editFundingStreamsHref={editFundingStreams({}).$}
          editContributingCohortsHref={editContributingCohorts({}).$}
          editExternalProfilesHref={editExternalProfiles({}).$}
        />
        <Route path={editKeyInfo({}).$}>
          <KeyInformationModal
            {...userData}
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
        <Route path={editContactInfo({}).$}>
          <ContactInformationModal
            {...userData}
            {...commonModalProps}
            countryCodeSuggestions={countryCodesSuggestions}
          />
        </Route>
        <Route path={editBiography({}).$}>
          <BiographyModal {...userData} {...commonModalProps} />
        </Route>
        <Route path={editKeywords({}).$}>
          <KeywordsModal {...userData} {...commonModalProps} />
        </Route>
        <Route path={editQuestions({}).$}>
          <OpenQuestionsModal {...userData} {...commonModalProps} />
        </Route>
        <Route path={editFundingStreams({}).$}>
          <FundingProviderModal {...userData} {...commonModalProps} />
        </Route>
        <Route path={editContributingCohorts({}).$}>
          <ContributingCohortsModal
            {...userData}
            {...commonModalProps}
            cohortOptions={cohortOptions}
          />
        </Route>
        <Route path={editExternalProfiles({}).$}>
          <ExternalProfilesModal {...userData} {...commonModalProps} />
        </Route>
      </>
    );
  }
  return <NotFoundPage />;
};

export default Preview;
