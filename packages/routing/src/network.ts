import {
  number,
  route,
  string,
  Validator,
} from 'react-router-typesafe-routes/dom';

export const outputDocumentTypeValues = [
  'article',
  'bioinformatics',
  'dataset',
  'lab-resource',
  'protocol',
  'report',
] as const;

export type OutputDocumentTypeParameter =
  (typeof outputDocumentTypeValues)[number];

const outputDocumentTypeValidator: Validator<OutputDocumentTypeParameter> = (
  value: unknown,
): OutputDocumentTypeParameter => {
  ``;
  if (
    typeof value !== 'string' ||
    !outputDocumentTypeValues.includes(value as OutputDocumentTypeParameter)
  ) {
    throw new Error('Expected one of the OutputDocumentTypeParameter values');
  }

  return value as OutputDocumentTypeParameter;
};

const about = route('about');
const calendar = route('calendar');
const upcoming = route('upcoming');
const past = route('past');

const editPersonalInfo = route('edit-personal-info');
const editContactInfo = route('edit-contact-info');
const editOnboarded = route('edit-onboarded');
const editBiography = route('edit-biography');
const editExpertiseAndResources = route('edit-expertise-and-resources');
const editQuestions = route('edit-questions');
const editRole = route('edit-role');
const editTeamMembership = route('edit-team-membership/:teamId', {
  params: { teamId: string().defined() },
});

const outputs = route('outputs');
const draftOutputs = route('draft-outputs');
const duplicateOutput = route('duplicate/:id', {
  params: { id: string().defined() },
});
const createOutput = route('create-output/:outputDocumentType', {
  params: {
    outputDocumentType: string(outputDocumentTypeValidator).defined(),
  },
});

const tool = route(':toolIndex', {
  params: { toolIndex: number().defined() },
});
const tools = route('tools/*', {}, { TOOL: tool });
const createManuscript = route('create-manuscript');

const workspace = route(
  'workspace/*',
  {},
  { TOOLS: tools, CREATE_MANUSCRIPT: createManuscript },
);

export const networkRoutes = {
  DEFAULT: route(
    'network/*',
    {},
    {
      USERS: route(
        'users/*',
        {},
        {
          DETAILS: route(
            ':id/*',
            {
              params: { id: string().defined() },
            },
            {
              ABOUT: route(
                'about/*',
                {},
                {
                  EDIT_PERSONAL_INFO: editPersonalInfo,
                  EDIT_CONTACT_INFO: editContactInfo,
                  EDIT_ONBOARDED: editOnboarded,
                  EDIT_BIOGRAPHY: editBiography,
                },
              ),
              RESEARCH: route(
                'research/*',
                {},
                {
                  EDIT_PERSONAL_INFO: editPersonalInfo,
                  EDIT_CONTACT_INFO: editContactInfo,
                  EDIT_ONBOARDED: editOnboarded,
                  EDIT_EXPERTISE_AND_RESOURCES: editExpertiseAndResources,
                  EDIT_QUESTIONS: editQuestions,
                  EDIT_TEAM_MEMBERSHIP: editTeamMembership,
                  EDIT_ROLE: editRole,
                },
              ),
              OUTPUTS: route('outputs'),
              UPCOMING: route('upcoming'),
              PAST: route('past'),
            },
          ),
        },
      ),
      WORKING_GROUPS: route(
        'working-groups/*',
        {},
        {
          DETAILS: route(
            ':workingGroupId/*',
            {
              params: { workingGroupId: string().defined() },
            },
            {
              ABOUT: about,
              CREATE_OUTPUT: createOutput,
              DUPLICATE_OUTPUT: duplicateOutput,
              OUTPUTS: outputs,
              DRAFT_OUTPUTS: draftOutputs,
              CALENDAR: calendar,
              UPCOMING: upcoming,
              PAST: past,
            },
          ),
        },
      ),
      INTEREST_GROUPS: route(
        'interest-groups/*',
        {},
        {
          DETAILS: route(
            ':interestGroupId/*',
            {
              params: { interestGroupId: string().defined() },
            },
            {
              ABOUT: about,
              CALENDAR: calendar,
              UPCOMING: upcoming,
              PAST: past,
            },
          ),
        },
      ),
      TEAMS: route(
        'teams/*',
        {},
        {
          DETAILS: route(
            ':teamId/*',
            {
              params: { teamId: string().defined() },
            },
            {
              ABOUT: about,
              WORKSPACE: workspace,
              OUTPUTS: outputs,
              CREATE_OUTPUT: createOutput,
              DUPLICATE_OUTPUT: duplicateOutput,
              UPCOMING: upcoming,
              PAST: past,
              DRAFT_OUTPUTS: draftOutputs,
            },
          ),
        },
      ),
    },
  ),
};

// import { route, stringParser } from 'typesafe-routes';

// const user = (() => {
//   const editPersonalInfo = route('/edit-personal-info', {}, {});
//   const editContactInfo = route('/edit-contact-info', {}, {});
//   const editOnboarded = route('/edit-onboarded', {}, {});

//   const editBiography = route('/edit-biography', {}, {});
//   const about = route(
//     '/about',
//     {},
//     {
//       editPersonalInfo,
//       editContactInfo,
//       editOnboarded,
//       editBiography,
//     },
//   );

//   const editExpertiseAndResources = route(
//     '/edit-expertise-and-resources',
//     {},
//     {},
//   );
//   const editQuestions = route('/edit-questions', {}, {});

//   const editRole = route('/edit-role', {}, {});
//   const editTeamMembership = route(
//     '/edit-team-membership/:teamId',
//     { teamId: stringParser },
//     {},
//   );
//   const research = route(
//     '/research',
//     {},
//     {
//       editPersonalInfo,
//       editContactInfo,
//       editOnboarded,
//       editExpertiseAndResources,
//       editQuestions,
//       editTeamMembership,
//       editRole,
//     },
//   );

//   const outputs = route(
//     '/outputs',
//     {},
//     { editPersonalInfo, editContactInfo, editOnboarded },
//   );

//   const upcoming = route(
//     '/upcoming',
//     {},
//     { editPersonalInfo, editContactInfo, editOnboarded },
//   );

//   const past = route(
//     '/past',
//     {},
//     { editPersonalInfo, editContactInfo, editOnboarded },
//   );

//   return route(
//     '/:userId',
//     { userId: stringParser },
//     { about, research, outputs, upcoming, past },
//   );
// })();
// const users = route('/users', {}, { user });

// const outputDocumentTypeParser = {
//   parse: (data: string): OutputDocumentTypeParameter =>
//     data as OutputDocumentTypeParameter,
//   serialize: (data: OutputDocumentTypeParameter): string => data,
// };

// const team = (() => {
//   const draftOutputs = route('/draft-outputs', {}, {});

//   const about = route('/about', {}, {});
//   const outputs = route('/outputs', {}, {});

//   const tool = route('/:toolIndex', { toolIndex: stringParser }, {});
//   const tools = route('/tools', {}, { tool });
//   const createManuscript = route('/create-manuscript', {}, {});
//   const workspace = route('/workspace', {}, { tools, createManuscript });
//   const createOutput = route(
//     '/create-output/:outputDocumentType',
//     { outputDocumentType: outputDocumentTypeParser },
//     {},
//   );
//   const duplicateOutput = route('/duplicate/:id', { id: stringParser }, {});

//   const upcoming = route('/upcoming', {}, {});
//   const past = route('/past', {}, {});

//   return route(
//     '/:teamId',
//     { teamId: stringParser },
//     {
//       about,
//       workspace,
//       outputs,
//       createOutput,
//       duplicateOutput,
//       upcoming,
//       past,
//       draftOutputs,
//     },
//   );
// })();
// const teams = route('/teams', {}, { team });

// const interestGroup = (() => {
//   const about = route('/about', {}, {});
//   const calendar = route('/calendar', {}, {});
//   const upcoming = route('/upcoming', {}, {});
//   const past = route('/past', {}, {});

//   return route(
//     '/:interestGroupId',
//     { interestGroupId: stringParser },
//     { about, calendar, upcoming, past },
//   );
// })();
// const interestGroups = route('/interest-groups', {}, { interestGroup });

// const workingGroup = (() => {
//   const draftOutputs = route('/draft-outputs', {}, {});
//   const about = route('/about', {}, {});
//   const outputs = route('/outputs', {}, {});
//   const createOutput = route(
//     '/create-output/:outputDocumentType',
//     { outputDocumentType: outputDocumentTypeParser },
//     {},
//   );
//   const duplicateOutput = route('/duplicate/:id', { id: stringParser }, {});
//   const calendar = route('/calendar', {}, {});
//   const upcoming = route('/upcoming', {}, {});
//   const past = route('/past', {}, {});

//   return route(
//     '/:workingGroupId',
//     { workingGroupId: stringParser },
//     {
//       about,
//       createOutput,
//       duplicateOutput,
//       outputs,
//       draftOutputs,
//       calendar,
//       upcoming,
//       past,
//     },
//   );
// })();

// const workingGroups = route('/working-groups', {}, { workingGroup });

// export default route(
//   '/network',
//   {},
//   { users, teams, interestGroups, workingGroups },
// );
