import { route } from 'react-router-typesafe-routes/dom';

const staticPages = {
  DEFAULT: route(
    '',
    {},
    {
      TERMS: route('terms-and-conditions'),
      PRIVACY_POLICY: route('privacy-policy'),
    },
  ),
};
export default staticPages;
