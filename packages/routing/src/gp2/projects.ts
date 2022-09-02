import { route, stringParser } from 'typesafe-routes';

const project = route('/:projectId', { projectId: stringParser }, {});
const projects = route('/projects', {}, { project });

export default projects;
