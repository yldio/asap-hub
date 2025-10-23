import { route } from 'typesafe-routes';

const discoveryProjects = route('/discovery-projects', {}, {});
const resourceProjects = route('/resource-projects', {}, {});
const traineeProjects = route('/trainee-projects', {}, {});

export default route(
  '/projects',
  {},
  { discoveryProjects, resourceProjects, traineeProjects },
);
