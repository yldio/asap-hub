import { route } from 'typesafe-routes';

const welcome = route('/welcome', {}, {});
const coreDetails = route('/core-details', {}, {});

const onboarding = route('/onboarding', {}, { welcome, coreDetails });

export default onboarding;
