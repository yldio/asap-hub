import { route } from 'typesafe-routes';

const editKeyInfo = route('/edit-key-info', {}, {});
const editContactInfo = route('/edit-contact-info', {}, {});

const coreDetails = route(
  '/core-details',
  {},
  { editKeyInfo, editContactInfo },
);

const onboarding = route('/', {}, { coreDetails });

export default onboarding;
