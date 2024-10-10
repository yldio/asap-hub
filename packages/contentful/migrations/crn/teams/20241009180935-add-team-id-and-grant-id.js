module.exports.description = 'Add team id and grant id fields';

module.exports.up = (migration) => {
  const teams = migration.editContentType('teams');

  teams
    .createField('teamId')
    .name('Team ID')
    .type('Symbol')
    .localized(false)
    .required(true)
    .validations([])
    .disabled(false)
    .omitted(false);

  teams
    .createField('grantId')
    .name('Grant ID')
    .type('Symbol')
    .localized(false)
    .required(true)
    .validations([])
    .disabled(false)
    .omitted(false);

  teams.moveField('teamId').afterField('displayName');
  teams.moveField('grantId').afterField('teamId');
};

module.exports.down = (migration) => {
  const teams = migration.editContentType('teams');
  teams.deleteField('teamId');
  teams.deleteField('grantId');
};
