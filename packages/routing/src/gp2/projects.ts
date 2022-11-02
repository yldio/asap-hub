import { route, stringParser } from 'typesafe-routes';

const project = (() => {
  const edit = route('/edit', {}, {});
  const add = route('/add', {}, {});
  const overview = route('/overview', {}, {});
  const resources = route('/resources', {}, { add, edit });
  return route(
    '/:projectId',
    { projectId: stringParser },
    { overview, resources },
  );
})();

const projects = route('/projects', {}, { project });

export default projects;
