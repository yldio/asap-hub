import { route } from 'typesafe-routes';

const tutorials = route('/tutorials', {}, {});
const guides = route('/guides', {}, {});
const workingGroups = route('/working-groups', {}, {});

export default route('/discover', {}, { tutorials, guides, workingGroups });
