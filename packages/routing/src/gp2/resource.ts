import { route, string } from 'react-router-typesafe-routes/dom';

const resource = route(':resourceIndex', {
  params: {
    resourceIndex: string().defined(),
  },
});

export default resource;
