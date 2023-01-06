import { route, stringParser } from 'typesafe-routes';

const tutorial = route('/:tutorialId', { tutorialId: stringParser }, {});
const tutorials = route('/tutorials', {}, { tutorial });
const guides = route('/guides', {}, {});
const about = route('/about', {}, {});

export default route('/discover', {}, { tutorials, guides, about });
