import { route, stringParser } from 'typesafe-routes';

const workingGroup = (() => {
  const overview = route('/overview', {}, {});
  const resources = route('/resources', {}, {});
  return route(
    '/:workingGroupId',
    { workingGroupId: stringParser },
    { overview, resources },
  );
})();

const workingGroups = route('/working-groups', {}, { workingGroup });

export default workingGroups;
