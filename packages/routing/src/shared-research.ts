import { route, stringParser } from 'typesafe-routes';

const researchOutput = route(
  '/:researchOutputId',
  { researchOutputId: stringParser },
  {},
);
const editResearchOutput = route(
  '/:researchOutputId/edit',
  { researchOutputId: stringParser },
  {},
);

const sharedResearch = route(
  '/shared-research',
  {},
  { researchOutput, editResearchOutput },
);

export default sharedResearch;
