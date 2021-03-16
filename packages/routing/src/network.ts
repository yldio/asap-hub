import { intParser, route, stringParser } from 'typesafe-routes';

const user = (() => {
  const editPersonalInfo = route('/edit-personal-info', {}, {});
  const editContactInfo = route('/edit-contact-info', {}, {});

  const editBiography = route('/edit-biography', {}, {});
  const editWorks = route('/edit-works', {}, {});
  const about = route(
    '/about',
    {},
    { editPersonalInfo, editContactInfo, editBiography, editWorks },
  );

  const editSkills = route('/edit-skills', {}, {});
  const editQuestions = route('/edit-questions', {}, {});
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
      editSkills,
      editQuestions,
      editTeamMembership,
    },
  );

  const outputs = route('/outputs', {}, { editPersonalInfo, editContactInfo });

  return route(
    '/:userId',
    { userId: stringParser },
    { about, research, outputs },
  );
})();
const users = route('/users', {}, { user });

const team = (() => {
  const about = route('/about', {}, {});
  const outputs = route('/outputs', {}, {});

  const tool = route('/:toolIndex', { toolIndex: intParser }, {});
  const tools = route('/tools', {}, { tool });
  const workspace = route('/workspace', {}, { tools });

  return route(
    '/:teamId',
    { teamId: stringParser },
    { about, workspace, outputs },
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

export default route('/network', {}, { users, teams, groups });
