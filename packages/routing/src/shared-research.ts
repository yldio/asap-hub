import { route, stringParser } from 'typesafe-routes';

const researchOutput = route(
  '/:researchOutputId',
  { researchOutputId: stringParser },
  {},
);
const sharedResearch = route('/shared-research', {}, { researchOutput });

export default sharedResearch;
