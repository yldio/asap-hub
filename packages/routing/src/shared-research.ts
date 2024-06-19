import { boolean, route, string } from 'react-router-typesafe-routes/dom';

const editResearchOutput = route('edit/:researchOutputId', {
  params: { researchOutputId: string().defined() },
});

const versionResearchOutput = route('version/:researchOutputId', {
  params: { researchOutputId: string().defined() },
});

const publishResearchOutput = route('publishedNow/:researchOutputId', {
  params: { researchOutputId: string().defined() },
});

export const sharedResearchRoutes = {
  DEFAULT: route(
    'shared-research/*',
    {},
    {
      LIST: route(''),
      DETAILS: route(
        ':researchOutputId/*',
        {
          params: {
            researchOutputId: string().defined(),
          },
          searchParams: {
            draftCreated: boolean().defined(),
          },
        },
        {
          EDIT_RESEARCH_OUTPUT: editResearchOutput,
          VERSION_RESEARCH_OUTPUT: versionResearchOutput,
          PUBLISH_RESEARCH_OUTPUT: publishResearchOutput,
        },
      ),
    },
  ),
};

// const editResearchOutput = route(
//   '/edit',
//   { researchOutputId: stringParser },
//   {},
// );

// const versionResearchOutput = route(
//   '/version',
//   { researchOutputId: stringParser },
//   {},
// );

// const researchOutputPublished = route(
//   '/publishedNow',
//   { researchOutputId: stringParser },
//   {},
// );

// const researchOutput = route(
//   '/:researchOutputId&:draftCreated?',
//   {
//     researchOutputId: stringParser,
//     draftCreated: booleanParser,
//   },
//   { editResearchOutput, researchOutputPublished, versionResearchOutput },
// );

// const sharedResearch = route('/shared-research', {}, { researchOutput });

// export default sharedResearch;
