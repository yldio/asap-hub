module.exports.description = 'Create milestone content model';

module.exports.up = function (migration) {
  const milestone = migration
    .createContentType('milestone')
    .name('Milestone')
    .description('')
    .displayField('title');

  milestone
    .createField('title')
    .name('Title')
    .type('Text')
    .localized(false)
    .required(true)
    .validations([])
    .disabled(false)
    .omitted(false);

  milestone
    .createField('description')
    .name('Description')
    .type('Text')
    .localized(false)
    .required(true)
    .validations([])
    .disabled(false)
    .omitted(false);

  milestone
    .createField('status')
    .name('Status')
    .type('Symbol')
    .localized(false)
    .required(true)
    .validations([
      {
        in: ['Not_Started', 'Active', 'Completed'],
      },
    ])
    .disabled(false)
    .omitted(false);

  milestone
    .createField('externalLink')
    .name('External Link')
    .type('Symbol')
    .localized(false)
    .required(false)
    .validations([
      {
        regexp: {
          pattern:
            '^(ftp|http|https):\\/\\/(\\w+:{0,1}\\w*@)?(\\S+)(:[0-9]+)?(\\/|\\/([\\w#!:.?+=&%@!\\-/]))?$',
          flags: null,
        },
      },
    ])
    .disabled(false)
    .omitted(false);

  milestone.changeFieldControl('title', 'builtin', 'singleLine', {});
  milestone.changeFieldControl('role', 'builtin', 'dropdown', {});
  milestone.changeFieldControl('description', 'builtin', 'multiLine', {});
  milestone.changeFieldControl('externalLink', 'builtin', 'urlEditor', {
    helpText: 'URL must start with http:// or https://',
  });
};

module.exports.down = (migration) => {
  migration.deleteContentType('projectMembership');
};
