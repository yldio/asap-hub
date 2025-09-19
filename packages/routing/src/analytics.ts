import { route, stringParser } from 'typesafe-routes';

const metric = route('/:metric', { metric: stringParser }, {});
const collaborationPath = route(
  '/:metric/:type?',
  { metric: stringParser, type: stringParser },
  {},
);

const pocDemo = route('/poc-demo', {}, {});

const collaboration = route(
  '/collaboration',
  {},
  { collaborationPath, pocDemo },
);

const leadership = route('/leadership', {}, { metric });

const openScience = route('/open-science', {}, { metric });

const productivity = route('/productivity', {}, { metric });

const engagement = route('/engagement', {}, { metric });

export default route(
  '/analytics',
  {},
  { collaboration, leadership, productivity, engagement, openScience },
);
