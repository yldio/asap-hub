import { route, stringParser } from 'typesafe-routes';

const tutorial = route('/:tutorialId', { tutorialId: stringParser }, {});
const tutorials = route('/tutorials', {}, { tutorial });
const guides = route('/guides', {}, {});

export default route('/guides-tutorials', {}, { tutorials, guides });
