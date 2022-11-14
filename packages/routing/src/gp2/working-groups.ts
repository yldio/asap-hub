import { route, stringParser } from 'typesafe-routes';

const workingGroup = (() => {
  const resource = route(
    '/:resourceIndex',
    { resourceIndex: stringParser },
    {},
  );
  const edit = route('/edit', {}, { resource });
  const add = route('/add', {}, {});
  const overview = route('/overview', {}, {});
  const resources = route('/resources', {}, { add, edit });
  return route(
    '/:workingGroupId',
    { workingGroupId: stringParser },
    { overview, resources },
  );
})();

const workingGroups = route('/working-groups', {}, { workingGroup });

export default workingGroups;
