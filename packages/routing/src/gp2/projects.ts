import { route, string } from 'react-router-typesafe-routes/dom';
import resource from './resource';
import { outputDocumentTypeValidator } from './working-groups';

// const project = (() => {
//   const edit = route('/edit', {}, { resource });
//   const add = route('/add', {}, {});
//   const overview = route('/overview', {}, {});
//   const workspace = route('/workspace', {}, { add, edit });

//   const upcoming = route('/upcoming', {}, {});
//   const past = route('/past', {}, {});
//   const outputs = route('/outputs', {}, {});
//   const createOutput = route(
//     '/create-output/:outputDocumentType',
//     { outputDocumentType: outputDocumentTypeParser },
//     {},
//   );
//   const duplicateOutput = route(
//     '/duplicate/:outputId',
//     { outputId: stringParser },
//     {},
//   );

//   return route(
//     '/:projectId',
//     { projectId: stringParser },
//     {
//       overview,
//       workspace,
//       upcoming,
//       past,
//       outputs,
//       createOutput,
//       duplicateOutput,
//     },
//   );
// })();

// const projects = route('/projects', {}, { project });

const edit = route('edit', {}, { RESOURCE: resource });
const add = route('add');
const overview = route('overview');
const workspace = route('workspace/*', {}, { ADD: add, EDIT: edit });

const upcoming = route('upcoming');
const past = route('past');
const outputs = route('outputs');
const createOutput = route('create-output/:outputDocumentType', {
  params: {
    outputDocumentType: string(outputDocumentTypeValidator).defined(),
  },
});
const duplicateOutput = route('duplicate/:outputId', {
  params: { outputId: string().defined() },
});

const projects = {
  DEFAULT: route(
    'projects/*',
    {},
    {
      LIST: route(''),
      DETAILS: route(
        ':projectId/*',
        {
          params: {
            projectId: string().defined(),
          },
        },
        {
          OVERVIEW: overview,
          WORKSPACE: workspace,
          UPCOMING: upcoming,
          PAST: past,
          OUTPUTS: outputs,
          CREATE_OUTPUT: createOutput,
          DUPLICATE_OUTPUT: duplicateOutput,
        },
      ),
    },
  ),
};

export default projects;
