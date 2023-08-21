import { booleanParser, route, stringParser } from 'typesafe-routes';

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

const researchOutputPublished = route(
  '/publishedNow',
  { researchOutputId: stringParser },
  {},
);

const researchOutput = route(
  '/:researchOutputId&:draftCreated?',
  {
    researchOutputId: stringParser,
    draftCreated: booleanParser,
  },
  { editResearchOutput, researchOutputPublished, versionResearchOutput },
);

const sharedResearch = route('/shared-research', {}, { researchOutput });

export default sharedResearch;
