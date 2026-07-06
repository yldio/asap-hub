import { route, stringParser } from 'typesafe-routes';

const manuscript = route(
  '/manuscripts/:manuscriptId',
  { manuscriptId: stringParser },
  {},
);

export default route('/compliance', {}, { manuscript });
