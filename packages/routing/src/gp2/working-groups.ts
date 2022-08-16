import { route, stringParser } from 'typesafe-routes';

const workingGroup = route(
  '/:workingGroupId',
  { workingGroupId: stringParser },
  {},
);

const workingGroups = route('/working-groups', {}, { workingGroup });

export default workingGroups;
