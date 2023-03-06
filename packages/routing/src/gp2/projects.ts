import { route, stringParser } from 'typesafe-routes';
import resource from './resource';
import { outputDocumentTypeParser } from './working-groups';

const project = (() => {
  const edit = route('/edit', {}, { resource });
  const add = route('/add', {}, {});
  const overview = route('/overview', {}, {});
  const resources = route('/resources', {}, { add, edit });

  const upcoming = route('/past', {}, {});
  const past = route('/past', {}, {});
  const outputs = route('/outputs', {}, {});
  const createOutput = route(
    '/create-output/:outputDocumentType',
    { outputDocumentType: outputDocumentTypeParser },
    {},
  );

  return route(
    '/:projectId',
    { projectId: stringParser },
    { overview, resources, upcoming, past, outputs, createOutput },
  );
})();

const projects = route('/projects', {}, { project });

export default projects;
