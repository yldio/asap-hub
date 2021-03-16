import { route, stringParser } from 'typesafe-routes';

const invited = route('/:code', { code: stringParser }, {});
const welcome = route('/welcome', {}, { invited });

export default welcome;
