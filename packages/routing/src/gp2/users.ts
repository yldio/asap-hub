import { route, stringParser } from 'typesafe-routes';

const filters = route('/filters', {}, {});

const editKeyInfo = route('/edit-key-info', {}, {});
const editContactInfo = route('/edit-contact-info', {}, {});
const editBiography = route('/edit-biography', {}, {});
const editKeywords = route('/edit-keywords', {}, {});
const editQuestions = route('/edit-questions', {}, {});
const editFundingStreams = route('/edit-funding-streams', {}, {});
const editContributingCohorts = route('/edit-contributing-cohorts', {}, {});
const editExternalProfiles = route('/edit-external-profiles', {}, {});
const overview = route(
  '/overview',
  {},
  {
    editKeyInfo,
    editContactInfo,
    editBiography,
    editKeywords,
    editQuestions,
    editFundingStreams,
    editContributingCohorts,
    editExternalProfiles,
  },
);
const outputs = route('/outputs', {}, {});

const user = route(
  '/:userId',
  { userId: stringParser },
  {
    overview,
    outputs,
  },
);

const users = route('/users', {}, { user, filters });

export default users;
