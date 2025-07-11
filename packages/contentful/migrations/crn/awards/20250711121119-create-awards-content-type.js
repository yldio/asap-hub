module.exports.description = 'Create awards content type';

module.exports.up = (migration) => {
  const awards = migration
    .createContentType('awards')
    .name('Awards')
    .description('')
    .displayField('type');

  awards
    .createField('type')
    .name('Type')
    .type('Symbol')
    .localized(false)
    .required(true)
    .validations([
      {
        in: ['Open Science Champion'],
      },
    ])
    .disabled(false)
    .omitted(false);

  awards
    .createField('date')
    .name('Date')
    .type('Date')
    .localized(false)
    .required(true)
    .validations([])
    .disabled(false)
    .omitted(false);
  awards.changeFieldControl('type', 'builtin', 'dropdown', {});
  awards.changeFieldControl('date', 'builtin', 'datePicker', {});
};

module.exports.down = (migration) => {
  migration.deleteContentType('awards');
};
