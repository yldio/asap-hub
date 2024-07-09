import { route, string } from 'react-router-typesafe-routes/dom';

export const discoverRoutes = {
  DEFAULT: route(
    'guides-tutorials/*',
    {},
    {
      LIST: route(''),
      GUIDES: route('guides'),
      TUTORIALS: route(
        'tutorials/*',
        {},
        {
          LIST: route(''),
          DETAILS: route(':id', {
            params: { id: string().defined() },
          }),
        },
      ),
    },
  ),
};
