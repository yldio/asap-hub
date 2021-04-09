import { route } from 'typesafe-routes';

const terms = route('/terms-and-conditions', {}, {});
const privacyPolicy = route('/privacy-policy', {}, {});

export default route('', {}, { terms, privacyPolicy });
