module.exports.description =
  'Rename the Trainee Project membership roles to Individual Project and fold Key Personnel into Mentor';

const STABLE_ROLES = [
  'Lead PI',
  'Co-PI',
  'Collaborating PI',
  'Project Manager',
  'Data Manager',
  'Staff Scientist',
  'ASAP Staff',
  'Trainee',
];

const OLD_LEAD = 'Trainee Project - Lead';
const NEW_LEAD = 'Individual Project - Lead';
const OLD_MENTOR = 'Trainee Project - Mentor';
const NEW_MENTOR = 'Individual Project - Mentor';
const OLD_KEY_PERSONNEL = 'Trainee Project - Key Personnel';

const OLD_PROJECT_ROLES = [OLD_LEAD, OLD_MENTOR, OLD_KEY_PERSONNEL];
const NEW_PROJECT_ROLES = [NEW_LEAD, NEW_MENTOR];
const ALL_PROJECT_ROLES = [...OLD_PROJECT_ROLES, ...NEW_PROJECT_ROLES];

const setRoleValidations = (migration, roles) =>
  migration
    .editContentType('projectMembership')
    .editField('role')
    .validations([{ in: roles }]);

const transformRole = (fromValue, toValue) => (fromFields, currentLocale) => {
  if (fromFields.role && fromFields.role[currentLocale] === fromValue) {
    return { role: toValue };
  }
  return undefined;
};

const remapRole = (migration, fromValue, toValue) =>
  migration.transformEntries({
    contentType: 'projectMembership',
    from: ['role'],
    to: ['role'],
    transformEntryForLocale: transformRole(fromValue, toValue),
  });

module.exports.up = (migration) => {
  // Widen first so republishing during the transform cannot fail validation.
  setRoleValidations(migration, [...STABLE_ROLES, ...ALL_PROJECT_ROLES]);

  remapRole(migration, OLD_LEAD, NEW_LEAD);
  remapRole(migration, OLD_MENTOR, NEW_MENTOR);
  remapRole(migration, OLD_KEY_PERSONNEL, NEW_MENTOR);

  setRoleValidations(migration, [...STABLE_ROLES, ...NEW_PROJECT_ROLES]);
};

// Key Personnel is folded into Mentor by up(), so down() cannot tell an
// original Mentor from a former Key Personnel — both revert to Mentor.
module.exports.down = (migration) => {
  setRoleValidations(migration, [...STABLE_ROLES, ...ALL_PROJECT_ROLES]);

  remapRole(migration, NEW_LEAD, OLD_LEAD);
  remapRole(migration, NEW_MENTOR, OLD_MENTOR);

  setRoleValidations(migration, [...STABLE_ROLES, ...OLD_PROJECT_ROLES]);
};
