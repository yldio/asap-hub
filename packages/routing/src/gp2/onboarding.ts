import { route } from 'typesafe-routes';

const editKeyInfo = route('/edit-key-info', {}, {});
const editContactInfo = route('/edit-contact-info', {}, {});
const editBiography = route('/edit-biography', {}, {});
const editTags = route('/edit-tags', {}, {});
const editQuestions = route('/edit-questions', {}, {});
const editFundingStreams = route('/edit-funding-streams', {}, {});
const editContributingCohorts = route('/edit-contributing-cohorts', {}, {});
const editExternalProfiles = route('/edit-external-profiles', {}, {});
const publish = route('/publish', {}, {});

const coreDetails = route(
  '/core-details',
  {},
  { editKeyInfo, editContactInfo },
);

const background = route('/background', {}, { editBiography, editTags });

const groups = route('/groups', {}, {});

const additionalDetails = route(
  '/additional-details',
  {},
  {
    editQuestions,
    editFundingStreams,
    editContributingCohorts,
    editExternalProfiles,
  },
);

const preview = route(
  '/preview',
  {},
  {
    editKeyInfo,
    editContactInfo,
    editBiography,
    editTags,
    editQuestions,
    editFundingStreams,
    editContributingCohorts,
    editExternalProfiles,
    publish,
  },
);

const onboarding = route(
  '/',
  {},
  { coreDetails, background, groups, additionalDetails, preview },
);

export default onboarding;
