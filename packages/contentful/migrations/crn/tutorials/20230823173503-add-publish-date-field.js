module.exports.description = 'Adds publishDate field';

module.exports.up = function (migration) {
  const tutorials = migration.editContentType('tutorials');
  tutorials
    .createField('publishDate')
    .name('Publish Date')
    .type('Date')
    .localized(false)
    .required(true)
    .validations([])
    .disabled(false)
    .omitted(false);

  // field-as-first-published-at app
  tutorials.changeFieldControl('publishDate', 'app', '6AEbdOZc7KICbwW6KszNlp');
};

module.exports.down = (migration) => {
  const tutorials = migration.editContentType('tutorials');
  tutorials.deleteField('publishDate');
};
