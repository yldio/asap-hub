import { route, stringParser } from 'typesafe-routes';

const tags = route(
  '/tags&:tag?',
  {
    tag: stringParser,
  },
  {},
);

export default tags;
