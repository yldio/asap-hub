import { route, stringParser } from 'typesafe-routes';

const resource = route('/:resourceIndex', { resourceIndex: stringParser }, {});

export default resource;
