module.exports.description =
  'Add open science team field and delete research theme';

module.exports.up = (migration) => {
  const users = migration.editContentType('users');
  users.deleteField('researchTheme');

  users
    .createField('openScienceTeamMember')
    .name('Open Science Team Member')
    .type('Boolean')
    .localized(false)
    .required(false)
    .validations([])
    .defaultValue({
      'en-US': false,
    })
    .disabled(false)
    .omitted(false);

  users.changeFieldControl('openScienceTeamMember', 'builtin', 'boolean', {});
  users.moveField('openScienceTeamMember').afterField('role');
};

module.exports.down = (migration) => {
  const users = migration.editContentType('users');
  users
    .createField('researchTheme')
    .name('Research Theme')
    .type('Array')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false)
    .items({
      type: 'Symbol',
      validations: [],
    });

  users.changeFieldControl('researchTheme', 'builtin', 'tagEditor', {});
  users.moveField('researchTheme').afterField('researchTags');

  users.deleteField('openScienceTeamMember');
};
