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

  teams
    .createField('teamDescription')
    .name('Team Description')
    .type('Text')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);

  teams.changeFieldControl('teamDescription', 'builtin', 'multipleLine', {});
  teams.moveField('teamType').afterField('teamId');
  teams.moveField('teamDescription').afterField('teamType');
};

module.exports.down = (migration) => {
  const teams = migration.editContentType('teams');
  teams.deleteField('teamType');
  teams.deleteField('teamDescription');
};
