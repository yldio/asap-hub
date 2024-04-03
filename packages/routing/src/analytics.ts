import { route, stringParser } from 'typesafe-routes';

const metric = route('/:metric', { metric: stringParser }, {});

const leadership = route('/leadership', {}, { metric });

const productivity = route('/productivity', {}, { metric });

export default route('/analytics', {}, { leadership, productivity });
