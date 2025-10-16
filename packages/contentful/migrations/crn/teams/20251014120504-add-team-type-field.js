module.exports.description = 'Add team type field';

module.exports.up = (migration) => {
  const teams = migration.editContentType('teams');
  teams
    .createField('teamType')
    .name('Team Type')
    .type('Symbol')
    .localized(false)
    .required(true)
    .validations([
      {
        in: ['Discovery Team', 'Resource Team'],
      },
    ])
    .disabled(false)
    .omitted(false);

  teams.moveField('teamType').afterField('displayName');
};

module.exports.down = (migration) => {
  const teams = migration.editContentType('teams');
  teams.deleteField('teamType');
};
