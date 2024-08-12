import { route, string } from 'react-router-typesafe-routes/dom';

// const filters = route('/filters', {}, {});

// const editKeyInfo = route('/edit-key-info', {}, {});
// const editContactInfo = route('/edit-contact-info', {}, {});
// const editBiography = route('/edit-biography', {}, {});
// const editTags = route('/edit-tags', {}, {});
// const editQuestions = route('/edit-questions', {}, {});
// const editFundingStreams = route('/edit-funding-streams', {}, {});
// const editContributingCohorts = route('/edit-contributing-cohorts', {}, {});
// const overview = route(
//   '/overview',
//   {},
//   {
//     editKeyInfo,
//     editContactInfo,
//     editBiography,
//     editTags,
//     editQuestions,
//     editFundingStreams,
//     editContributingCohorts,
//   },
// );
// const outputs = route('/outputs', {}, {});
// const upcoming = route('/upcoming', {}, {});
// const past = route('/past', {}, {});

// const user = route(
//   '/:userId',
//   { userId: stringParser },
//   {
//     overview,
//     outputs,
//     upcoming,
//     past,
//   },
// );

// const users = route('/users', {}, { user, filters });

const filters = route('filters');

const editKeyInfo = route('edit-key-info');
const editContactInfo = route('edit-contact-info');
const editBiography = route('edit-biography');
const editTags = route('edit-tags');
const editQuestions = route('edit-questions');
const editFundingStreams = route('edit-funding-streams');
const editContributingCohorts = route('edit-contributing-cohorts');

const overview = route(
  'overview',
  {},
  {
    EDIT_KEY_INFO: editKeyInfo,
    EDIT_CONTACT_INFO: editContactInfo,
    EDIT_BIOGRAPHY: editBiography,
    EDIT_TAGS: editTags,
    EDIT_QUESTIONS: editQuestions,
    EDIT_FUNDING_STREAMS: editFundingStreams,
    EDIT_CONTRIBUTING_COHORTS: editContributingCohorts,
  },
);

const outputs = route('outputs');
const upcoming = route('upcoming');
const past = route('past');

const users = {
  DEFAULT: route(
    'users/*',
    {},
    {
      LIST: route(''),
      DETAILS: route(
        ':userId/*',
        {
          params: {
            userId: string().defined(),
          },
        },
        {
          OVERVIEW: overview,
          OUTPUTS: outputs,
          UPCOMING: upcoming,
          PAST: past,
        },
      ),
      FILTERS: filters,
    },
  ),
};

export default users;
