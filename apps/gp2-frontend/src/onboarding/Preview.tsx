import {
  BiographyModal,
  ContactInformationModal,
  ContributingCohortsModal,
  FundingProviderModal,
  KeyInformationModal,
  TagsModal,
  OnboardingPreview,
  OpenQuestionsModal,
  PublishModal,
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

import { usePatchUserById, useUserById } from '../users/state';
import { useTags, useContributingCohorts } from '../shared/state';

const Preview: React.FC<Record<string, never>> = () => {
  const currentUser = useCurrentUserGP2();
  const { onboarding } = gp2Routing;
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const userData = useUserById(currentUser!.id);
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const patchUser = usePatchUserById(currentUser!.id);
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const { avatarSaving, onImageSelect } = useSelectAvatar(currentUser!.id);

  const { items: allTags } = useTags();

  const commonModalProps = {
    backHref: onboarding({}).preview({}).$,
    onSave: (patchedUser: gp2Model.UserPatchRequest) => patchUser(patchedUser),
  };
  const {
    editKeyInfo,
    editContactInfo,
    editBiography,
    editTags,
    editQuestions,
    editFundingStreams,
    editContributingCohorts,
    publish,
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
          editTagsHref={editTags({}).$}
          editQuestionsHref={editQuestions({}).$}
          editFundingStreamsHref={editFundingStreams({}).$}
          editContributingCohortsHref={editContributingCohorts({}).$}
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
        <Route path={editTags({}).$}>
          <TagsModal
            {...userData}
            {...commonModalProps}
            suggestions={allTags}
          />
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
        <Route path={publish({}).$}>
          <PublishModal {...commonModalProps} />
        </Route>
      </>
    );
  }
  return <NotFoundPage />;
};

export default Preview;
