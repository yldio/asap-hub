import { route, string } from 'react-router-typesafe-routes/dom';

// const edit = route('/edit', {}, {});
// const version = route('/version', {}, {});

// const output = route(
//   '/:outputId',
//   { outputId: stringParser },
//   {
//     edit,
//     version,
//   },
// );

// const outputs = route('/outputs', {}, { output });

const edit = route('edit');
const version = route('version');

const outputs = {
  DEFAULT: route(
    'outputs/*',
    {},
    {
      LIST: route(''),
      DETAILS: route(
        ':outputId/*',
        {
          params: {
            outputId: string().defined(),
          },
        },
        {
          EDIT: edit,
          VERSION: version,
        },
      ),
    },
  ),
};

export default outputs;
