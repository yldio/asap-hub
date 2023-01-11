import { route } from 'typesafe-routes';

const editKeyInfo = route('/edit-key-info', {}, {});
const editContactInfo = route('/edit-contact-info', {}, {});
const editBiography = route('/edit-biography', {}, {});
const editKeywords = route('/edit-keywords', {}, {});

const coreDetails = route(
  '/core-details',
  {},
  { editKeyInfo, editContactInfo },
);

const background = route('/background', {}, { editBiography, editKeywords });

const groups = route('/groups', {}, {});

const additionalDetails = route('/additional-details', {}, {});

const preview = route('/preview', {}, {});

const onboarding = route(
  '/',
  {},
  { coreDetails, background, groups, additionalDetails, preview },
);

export default onboarding;
