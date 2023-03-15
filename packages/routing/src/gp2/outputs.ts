import { route, stringParser } from 'typesafe-routes';

const edit = route('/edit', {}, {});

const output = route(
  '/:outputId',
  { outputId: stringParser },
  {
    edit,
  },
);

const outputs = route('/outputs', {}, { output });

export default outputs;
