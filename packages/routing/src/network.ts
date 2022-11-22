import { route, stringParser } from 'typesafe-routes';

const user = (() => {
  const editPersonalInfo = route('/edit-personal-info', {}, {});
  const editContactInfo = route('/edit-contact-info', {}, {});
  const editOnboarded = route('/edit-onboarded', {}, {});

  const editBiography = route('/edit-biography', {}, {});
  const about = route(
    '/about',
    {},
    {
      editPersonalInfo,
      editContactInfo,
      editOnboarded,
      editBiography,
    },
  );

  const editExpertiseAndResources = route(
    '/edit-expertise-and-resources',
    {},
    {},
  );
  const editQuestions = route('/edit-questions', {}, {});

  const editRole = route('/edit-role', {}, {});
  const editTeamMembership = route(
    '/edit-team-membership/:teamId',
    { teamId: stringParser },
    {},
  );
  const research = route(
    '/research',
    {},
    {
      editPersonalInfo,
      editContactInfo,
      editOnboarded,
      editExpertiseAndResources,
      editQuestions,
      editTeamMembership,
      editRole,
    },
  );

  const outputs = route(
    '/outputs',
    {},
    { editPersonalInfo, editContactInfo, editOnboarded },
  );

  const upcoming = route(
    '/upcoming',
    {},
    { editPersonalInfo, editContactInfo, editOnboarded },
  );

  const past = route(
    '/past',
    {},
    { editPersonalInfo, editContactInfo, editOnboarded },
  );

  return route(
    '/:userId',
    { userId: stringParser },
    { about, research, outputs, upcoming, past },
  );
})();
const users = route('/users', {}, { user });

export type OutputDocumentTypeParameter =
  | 'article'
  | 'bioinformatics'
  | 'dataset'
  | 'lab-resource'
  | 'protocol';

const outputDocumentTypeParser = {
  parse: (data: string): OutputDocumentTypeParameter =>
    data as OutputDocumentTypeParameter,
  serialize: (data: OutputDocumentTypeParameter): string => data,
};

const team = (() => {
  const about = route('/about', {}, {});
  const outputs = route('/outputs', {}, {});

  const tool = route('/:toolIndex', { toolIndex: stringParser }, {});
  const tools = route('/tools', {}, { tool });
  const workspace = route('/workspace', {}, { tools });
  const createOutput = route(
    '/create-output/:outputDocumentType',
    { outputDocumentType: outputDocumentTypeParser },
    {},
  );

  const upcoming = route('/upcoming', {}, {});
  const past = route('/past', {}, {});

  return route(
    '/:teamId',
    { teamId: stringParser },
    { about, workspace, outputs, createOutput, upcoming, past },
  );
})();
const teams = route('/teams', {}, { team });

const group = (() => {
  const about = route('/about', {}, {});
  const calendar = route('/calendar', {}, {});
  const upcoming = route('/upcoming', {}, {});
  const past = route('/past', {}, {});

  return route(
    '/:groupId',
    { groupId: stringParser },
    { about, calendar, upcoming, past },
  );
})();
const groups = route('/groups', {}, { group });

const workingGroup = (() => {
  const about = route('/about', {}, {});

  return route('/:workingGroupId', { workingGroupId: stringParser }, { about });
})();

const workingGroups = route('/working-groups', {}, { workingGroup });

export default route('/network', {}, { users, teams, groups, workingGroups });
