import { route } from 'typesafe-routes';

const tutorials = route('/tutorials', {}, {});
const guides = route('/guides', {}, {});

export default route('/discover', {}, { tutorials, guides });
