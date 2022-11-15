import { route, stringParser } from 'typesafe-routes';

const workingGroup = (() => {
  const about = route('/about', {}, {});

  return route('/:workingGroupId', { workingGroupId: stringParser }, { about });
})();

const workingGroups = route('/workings-groups', {}, { workingGroup });

export default workingGroups;
