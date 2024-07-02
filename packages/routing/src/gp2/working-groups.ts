import { route, string, Validator } from 'react-router-typesafe-routes/dom';
import resource from './resource';

export const outputDocumentTypeValues = [
  'article',
  'code-software',
  'dataset',
  'procedural-form',
  'training-materials',
  'gp2-reports',
] as const;

export type OutputDocumentTypeParameter =
  (typeof outputDocumentTypeValues)[number];

// export const outputDocumentTypeParser = {
//   parse: (data: string): OutputDocumentTypeParameter =>
//     data as OutputDocumentTypeParameter,
//   serialize: (data: OutputDocumentTypeParameter): string => data,
// };

export const outputDocumentTypeValidator: Validator<
  OutputDocumentTypeParameter
> = (value: unknown): OutputDocumentTypeParameter => {
  ``;
  if (
    typeof value !== 'string' ||
    !outputDocumentTypeValues.includes(value as OutputDocumentTypeParameter)
  ) {
    throw new Error('Expected one of the OutputDocumentTypeParameter values');
  }

  return value as OutputDocumentTypeParameter;
};

// const workingGroup = (() => {
//   const edit = route('/edit', {}, { resource });
//   const add = route('/add', {}, {});
//   const overview = route('/overview', {}, {});
//   const workspace = route('/workspace', {}, { add, edit });

//   const upcoming = route('/upcoming', {}, {});
//   const past = route('/past', {}, {});
//   const outputs = route('/outputs', {}, {});
//   const createOutput = route(
//     '/create-output/:outputDocumentType',
//     { outputDocumentType: outputDocumentTypeParser },
//     {},
//   );
//   const duplicateOutput = route(
//     '/duplicate/:outputId',
//     { outputId: stringParser },
//     {},
//   );

//   return route(
//     '/:workingGroupId',
//     { workingGroupId: stringParser },
//     {
//       overview,
//       workspace,
//       outputs,
//       upcoming,
//       past,
//       createOutput,
//       duplicateOutput,
//     },
//   );
// })();

// const operational = route('/operational', {}, {});
// const monogenic = route('/monogenic', {}, {});
// const complexDisease = route('/complex-disease', {}, {});
// const support = route('/support', {}, {});

// const workingGroups = route(
//   '/working-groups',
//   {},
//   { workingGroup, operational, monogenic, complexDisease, support },
// );

const edit = route('edit', {}, { RESOURCE: resource });
const add = route('add');

const overview = route('overview');
const workspace = route('workspace/*', {}, { ADD: add, EDIT: edit });
const upcoming = route('upcoming');
const past = route('past');
const outputs = route('outputs');
const createOutput = route('create-output/:outputDocumentType', {
  params: { outputDocumentType: string(outputDocumentTypeValidator).defined() },
});
const duplicateOutput = route('duplicate/:outputId', {
  params: { outputId: string().defined() },
});

const operational = route('operational');
const monogenic = route('monogenic');
const complexDisease = route('complex-disease');
const support = route('support');

const workingGroups = {
  DEFAULT: route(
    'working-groups/*',
    {},
    {
      DETAILS: route(
        ':workingGroupId/*',
        {
          params: {
            workingGroupId: string().defined(),
          },
        },
        {
          OVERVIEW: overview,
          WORKSPACE: workspace,
          OUTPUTS: outputs,
          UPCOMING: upcoming,
          PAST: past,
          CREATE_OUTPUT: createOutput,
          DUPLICATE_OUTPUT: duplicateOutput,
        },
      ),
      OPERATIONAL: operational,
      MONOGENIC: monogenic,
      COMPLEX_DISEASE: complexDisease,
      SUPPORT: support,
    },
  ),
};

export default workingGroups;
