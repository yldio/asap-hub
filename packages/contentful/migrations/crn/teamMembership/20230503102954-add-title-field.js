module.exports.description = 'Add title to team membership';

module.exports.up = (migration) => {
  const teamMembership = migration
    .editContentType('teamMembership')
    .displayField('title');

  teamMembership
    .createField('title')
    .name('Title')
    .type('Symbol')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(true);

  teamMembership.changeFieldControl(
    'title',
    'app',
    '2FMHOHfQOOTcOJlTrn4rne',
    {},
  );
};

module.exports.down = (migration) => {
  const teamMembership = migration.editContentType('teamMembership');
  teamMembership.deleteField('title');
};
