// import { route, stringParser } from 'typesafe-routes';
import { route, string } from 'react-router-typesafe-routes/dom';

// const tags = route(
//   '/tags&:tag?',
//   {
//     tag: stringParser,
//   },
//   {},
// );

// export default tags;

export const tagRoutes = route('tags/*', {
  searchParams: {
    tag: string().defined(),
  },
});
