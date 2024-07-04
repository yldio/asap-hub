import { route, stringParser } from 'typesafe-routes';

const metric = route('/:metric', { metric: stringParser }, {});
const collaborationPath = route(
  '/:metric/:type',
  { metric: stringParser, type: stringParser },
  {},
);

const collaboration = route('/collaboration', {}, { collaborationPath });

const leadership = route('/leadership', {}, { metric });

const productivity = route('/productivity', {}, { metric });

const engagement = route('/engagement', {}, {});

export default route(
  '/analytics',
  {},
  { collaboration, leadership, productivity, engagement },
);
