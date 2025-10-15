module.exports.description = 'Add type field';

module.exports.up = (migration) => {
  const teams = migration.editContentType('teams');
  teams
    .createField('type')
    .name('Type')
    .type('Symbol')
    .localized(false)
    .required(true)
    .validations([
      {
        in: ['Discovery', 'Resource'],
      },
    ])
    .disabled(false)
    .omitted(false);
};

module.exports.down = (migration) => {
  const teams = migration.editContentType('teams');
  teams.deleteField('type');
};
