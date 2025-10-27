import { route } from 'typesafe-routes';

const discoveryProjects = route('/discovery', {}, {});
const resourceProjects = route('/resource', {}, {});
const traineeProjects = route('/trainee', {}, {});

export default route(
  '/projects',
  {},
  { discoveryProjects, resourceProjects, traineeProjects },
);
