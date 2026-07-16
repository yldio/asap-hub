import { route, stringParser } from 'typesafe-routes';

const editResearchOutput = route(
  '/edit',
  { researchOutputId: stringParser },
  {},
);

const versionResearchOutput = route(
  '/version',
  { researchOutputId: stringParser },
  {},
);

const researchOutput = route(
  '/:researchOutputId',
  {
    researchOutputId: stringParser,
  },
  { editResearchOutput, versionResearchOutput },
);

const sharedResearch = route('/shared-research', {}, { researchOutput });

export default sharedResearch;
