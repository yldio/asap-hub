import { route, stringParser } from 'typesafe-routes';

const filters = route('/filters', {}, {});

const user = route('/:userId', { userId: stringParser }, {});
const users = route('/users', {}, { user, filters });

export default users;
