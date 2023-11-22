import { route, stringParser } from 'typesafe-routes';

const edit = route('/edit', {}, {});
const version = route('/version', {}, {});

const output = route(
  '/:outputId',
  { outputId: stringParser },
  {
    edit,
    version,
  },
);

const outputs = route('/outputs', {}, { output });

export default outputs;
