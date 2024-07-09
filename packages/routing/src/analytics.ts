// import { route, stringParser } from 'typesafe-routes';
import { route, string } from 'react-router-typesafe-routes/dom';

// const metric = route('/:metric', { metric: stringParser }, {});
// const collaborationPath = route(
//   '/:metric/:type',
//   { metric: stringParser, type: stringParser },
//   {},
// );

// const collaboration = route('/collaboration', {}, { collaborationPath });

// const leadership = route('/leadership', {}, { metric });

// const productivity = route('/productivity', {}, { metric });

// const engagement = route('/engagement', {}, {});

// export default route(
//   '/analytics',
//   {},
//   { collaboration, leadership, productivity, engagement },
// );
const metric = route(':metric', {
  params: { metric: string().defined() },
});

export const analyticsRoutes = {
  DEFAULT: route(
    'analytics/*',
    {},
    {
      LEADERSHIP: route(
        'leadership/*',
        {},
        {
          METRIC: metric,
        },
      ),
      PRODUCTIVITY: route(
        'productivity/*',
        {},
        {
          METRIC: metric,
        },
      ),
      COLLABORATION: route(
        'collaboration/*',
        {},
        {
          METRIC: route(':metric/:type', {
            params: {
              metric: string().defined(),
              type: string().defined(),
            },
          }),
        },
      ),
      ENGAGEMENT: route('engagement'),
    },
  ),
};
