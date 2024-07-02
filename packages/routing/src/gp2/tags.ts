import { route, string } from 'react-router-typesafe-routes/dom';

// const tags = route(
//   '/tags&:tag?',
//   {
//     tag: stringParser,
//   },
//   {},
// );

const tags = route('tags/*', {
  searchParams: {
    tag: string().defined(),
  },
});

export default tags;
