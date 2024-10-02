module.exports.description = 'Add email field';

module.exports.up = (migration) => {
  const externalAuthors = migration.editContentType('externalAuthors');
  externalAuthors
    .createField('email')
    .name('Email')
    .type('Symbol')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);
  externalAuthors.changeFieldControl('email', 'builtin', 'singleLine', {});
};

module.exports.down = (migration) => {
  const externalAuthors = migration.editContentType('externalAuthors');
  externalAuthors.deleteField('announcements');
};
