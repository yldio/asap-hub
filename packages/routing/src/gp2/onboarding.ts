import { route } from 'react-router-typesafe-routes/dom';

const editKeyInfo = route('edit-key-info');
const editContactInfo = route('edit-contact-info');
const editBiography = route('edit-biography');
const editTags = route('edit-tags');
const editQuestions = route('edit-questions');
const editFundingStreams = route('edit-funding-streams');
const editContributingCohorts = route('edit-contributing-cohorts');
const publish = route('publish');

const coreDetails = route(
  'core-details/*',
  {},
  {
    EDIT_KEY_INFO: editKeyInfo,
    EDIT_CONTACT_INFO: editContactInfo,
  },
);

const background = route(
  'background/*',
  {},
  { EDIT_BIOGRAPHY: editBiography, EDIT_TAGS: editTags },
);

const groups = route('groups');

const additionalDetails = route(
  'additional-details/*',
  {},
  {
    EDIT_QUESTIONS: editQuestions,
    EDIT_FUNDING_STREAMS: editFundingStreams,
    EDIT_CONTRIBUTING_COHORTS: editContributingCohorts,
  },
);

const preview = route(
  'preview/*',
  {},
  {
    EDIT_KEY_INFO: editKeyInfo,
    EDIT_CONTACT_INFO: editContactInfo,
    EDIT_BIOGRAPHY: editBiography,
    EDIT_TAGS: editTags,
    EDIT_QUESTIONS: editQuestions,
    EDIT_FUNDING_STREAMS: editFundingStreams,
    EDIT_CONTRIBUTING_COHORTS: editContributingCohorts,
    PUBLISH: publish,
  },
);

const onboarding = {
  DEFAULT: route(
    '*',
    {},
    {
      CORE_DETAILS: coreDetails,
      BACKGROUND: background,
      GROUPS: groups,
      ADDITIONAL_DETAILS: additionalDetails,
      PREVIEW: preview,
    },
  ),
};

export default onboarding;
