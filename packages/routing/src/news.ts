import { route, string } from 'react-router-typesafe-routes/dom';

export const newsRoutes = {
  DEFAULT: route(
    'news/*',
    {},
    {
      LIST: route(''),
      DETAILS: route(':id', {
        params: { id: string().defined() },
      }),
    },
  ),
};
