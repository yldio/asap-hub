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
import { Route, Routes } from 'react-router-dom';
import { loadInstitutionOptions } from '@asap-hub/frontend-utils';
import { useSelectAvatar } from '../hooks/useSelectAvatar';
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
        <Routes>
          <Route
            path={editKeyInfo.template.slice(1)}
            element={
              <KeyInformationModal
                {...userData}
                {...commonModalProps}
                locationSuggestions={locationSuggestions.map(
                  ({ shortName }) => shortName,
                )}
                loadInstitutionOptions={loadInstitutionOptions}
              />
            }
          />
          <Route
            path={editContactInfo.template.slice(1)}
            element={
              <ContactInformationModal
                {...userData}
                {...commonModalProps}
                countryCodeSuggestions={countryCodesSuggestions}
              />
            }
          />
          <Route
            path={editBiography.template.slice(1)}
            element={<BiographyModal {...userData} {...commonModalProps} />}
          />
          <Route
            path={editTags.template.slice(1)}
            element={
              <TagsModal
                {...userData}
                {...commonModalProps}
                suggestions={allTags}
              />
            }
          />
          <Route
            path={editQuestions.template.slice(1)}
            element={<OpenQuestionsModal {...userData} {...commonModalProps} />}
          />
          <Route
            path={editFundingStreams.template.slice(1)}
            element={
              <FundingProviderModal {...userData} {...commonModalProps} />
            }
          />
          <Route
            path={editContributingCohorts.template.slice(1)}
            element={
              <ContributingCohortsModal
                {...userData}
                {...commonModalProps}
                cohortOptions={cohortOptions}
              />
            }
          />
          <Route
            path={publish.template.slice(1)}
            element={<PublishModal {...commonModalProps} />}
          />
        </Routes>
      </>
    );
  }
  return <NotFoundPage />;
};

export default Preview;
