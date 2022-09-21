import { route, stringParser } from 'typesafe-routes';

const project = (() => {
  const overview = route('/overview', {}, {});
  const resources = route('/resources', {}, {});
  return route(
    '/:projectId',
    { projectId: stringParser },
    { overview, resources },
  );
})();

const projects = route('/projects', {}, { project });

export default projects;
