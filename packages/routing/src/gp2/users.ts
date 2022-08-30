import { route, stringParser } from 'typesafe-routes';

const user = route('/:userId', { userId: stringParser }, {});
const users = route('/users', {}, { user });

export default users;
