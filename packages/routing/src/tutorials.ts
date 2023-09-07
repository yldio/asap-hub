import { route, stringParser } from 'typesafe-routes';

const tutorial = route('/:tutorialId', { tutorialId: stringParser }, {});
export default route('/tutorials', {}, { tutorial });
