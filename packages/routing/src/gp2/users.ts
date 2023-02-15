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

const user = route(
  '/:userId',
  { userId: stringParser },
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

const users = route('/users', {}, { user, filters });

export default users;
