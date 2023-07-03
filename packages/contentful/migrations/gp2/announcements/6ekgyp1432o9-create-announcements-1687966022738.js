module.exports.description = 'Create announcements content model';

module.exports.up = function (migration) {
  const announcements = migration
    .createContentType('announcements')
    .name('Announcements')
    .description('')
    .displayField('description');
  announcements
    .createField('description')
    .name('Description')
    .type('Symbol')
    .localized(false)
    .required(true)
    .validations([])
    .disabled(false)
    .omitted(false);
  announcements
    .createField('deadline')
    .name('Deadline')
    .type('Date')
    .localized(false)
    .required(true)
    .validations([])
    .disabled(false)
    .omitted(false);
  announcements
    .createField('link')
    .name('Link')
    .type('Symbol')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);
  announcements.changeFieldControl('description', 'builtin', 'singleLine', {});
  announcements.changeFieldControl('deadline', 'builtin', 'datePicker', {});
  announcements.changeFieldControl('link', 'builtin', 'urlEditor', {});
};

module.exports.down = (migration) => {
  migration.deleteContentType('announcements');
};
