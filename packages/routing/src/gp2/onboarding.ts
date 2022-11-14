import { route } from 'typesafe-routes';

const coreDetails = route('/core-details', {}, {});

const onboarding = route('/', {}, { coreDetails });

export default onboarding;
