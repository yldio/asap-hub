import { route, stringParser } from 'typesafe-routes';

const leadership = route('/leadership/:metric', { metric: stringParser }, {});

const productivity = route(
  '/productivity/:metric',
  { metric: stringParser },
  {},
);

export default route('/analytics', {}, { leadership, productivity });
