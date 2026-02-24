import { route, stringParser } from 'typesafe-routes';

const discoveryProject = (() => {
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
  const workspace = route(
    '/workspace',
    {},
    { createManuscript, editManuscript, resubmitManuscript },
  );

  return route(
    '/:projectId',
    { projectId: stringParser },
    { about, workspace },
  );
})();

const resourceProject = (() => {
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
  const workspace = route(
    '/workspace',
    {},
    { createManuscript, editManuscript, resubmitManuscript },
  );

  return route(
    '/:projectId',
    { projectId: stringParser },
    { about, workspace },
  );
})();

const traineeProject = (() => {
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
  const workspace = route(
    '/workspace',
    {},
    { createManuscript, editManuscript, resubmitManuscript },
  );

  return route(
    '/:projectId',
    { projectId: stringParser },
    { about, workspace },
  );
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
