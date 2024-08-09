import { route } from 'react-router-typesafe-routes/dom';

export const dashboardRoutes = {
  DEFAULT: route(
    '',
    {},
    {
      DISMISS_GETTING_STARTED: route('dismiss-getting-started'),
    },
  ),
};
