import { route, stringParser } from 'typesafe-routes';

const createProjectRoute = () => {
  const about = route('/about', {}, {});
  const createManuscript = route('/create-manuscript', {}, {});
  const editManuscript = route(
    '/edit-manuscript/:manuscriptId',
    { manuscriptId: stringParser },
    {},
  );
  const resubmitManuscript = route(
    '/resubmit-manuscript/:manuscriptId',
    { manuscriptId: stringParser },
    {},
  );
  const tool = route('/tool/:toolIndex', { toolIndex: stringParser }, {});
  const tools = route('/tools', {}, { tool });
  const workspace = route(
    '/workspace',
    {},
    { createManuscript, editManuscript, resubmitManuscript, tools },
  );

  return route(
    '/:projectId',
    { projectId: stringParser },
    { about, workspace },
  );
};

const discoveryProject = createProjectRoute();
const resourceProject = createProjectRoute();
const traineeProject = createProjectRoute();

const discoveryProjects = route('/discovery', {}, { discoveryProject });
const resourceProjects = route('/resource', {}, { resourceProject });
const traineeProjects = route('/trainee', {}, { traineeProject });
const projects = route(
  '/projects',
  {},
  { discoveryProjects, resourceProjects, traineeProjects },
);

export default projects;
