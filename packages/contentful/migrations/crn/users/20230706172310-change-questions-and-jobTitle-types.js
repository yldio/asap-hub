module.exports.description =
  'Change question field type from Short Text Array to JSON Object and jobTitle field from Short Text to Long Text';

module.exports.up = (migration) => {
  const users = migration.editContentType('users');

  users.deleteField('questions');

  users
    .createField('questions')
    .name('Open Questions')
    .type('Object')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);

  users.changeFieldControl('questions', 'builtin', 'objectEditor', {});

  users.deleteField('jobTitle');

  users
    .createField('jobTitle')
    .name('Job Title')
    .type('Text')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);

  users.changeFieldControl('jobTitle', 'builtin', 'multipleLine', {});
};

module.exports.down = (migration) => {
  const users = migration.editContentType('users');

  users.deleteField('questions');
  users
    .createField('questions')
    .name('Open Questions')
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
  users.changeFieldControl('questions', 'builtin', 'tagEditor', {});

  users.deleteField('jobTitle');
  users
    .createField('jobTitle')
    .name('Job Title')
    .type('Symbol')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);
  users.changeFieldControl('jobTitle', 'builtin', 'singleLine', {});
};
