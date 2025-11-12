import { route, stringParser } from 'typesafe-routes';

const discoveryProject = (() => {
  const about = route('/about', {}, {});

  return route('/:projectId', { projectId: stringParser }, { about });
})();

const resourceProject = (() => {
  const about = route('/about', {}, {});

  return route('/:projectId', { projectId: stringParser }, { about });
})();

const traineeProject = (() => {
  const about = route('/about', {}, {});

  return route('/:projectId', { projectId: stringParser }, { about });
})();

const discoveryProjects = route('/discovery', {}, { discoveryProject });
const resourceProjects = route('/resource', {}, { resourceProject });
const traineeProjects = route('/trainee', {}, { traineeProject });
const projects = route(
  '/projects',
  {},
  { discoveryProjects, resourceProjects, traineeProjects },
);

export default projects;
