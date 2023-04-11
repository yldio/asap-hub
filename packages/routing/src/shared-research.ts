import { route, stringParser } from 'typesafe-routes';

const editResearchOutput = route(
  '/edit',
  { researchOutputId: stringParser },
  {},
);
const researchOutputPublished = route(
  '/publishedNow',
  { researchOutputId: stringParser },
  {},
);

const researchOutput = route(
  '/:researchOutputId',
  { researchOutputId: stringParser },
  { editResearchOutput, researchOutputPublished },
);

const sharedResearch = route('/shared-research', {}, { researchOutput });

export default sharedResearch;
