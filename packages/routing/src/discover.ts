import { route } from 'typesafe-routes';

const tutorials = route('/tutorials', {}, {});
const guides = route('/guides', {}, {});
const workingGroups = route('/working-groups', {}, {});
const about = route('/about', {}, {});

export default route(
  '/discover',
  {},
  { tutorials, guides, workingGroups, about },
);
