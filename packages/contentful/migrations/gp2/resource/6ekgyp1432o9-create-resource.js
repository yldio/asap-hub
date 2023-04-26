module.exports.description = 'Create milestone content model';

module.exports.up = function (migration) {
  const resource = migration
    .createContentType('milestone')
    .name('Milestone')
    .description('')
    .displayField('type');

  resource
    .createField('type')
    .name('Type')
    .type('Symbol')
    .localized(false)
    .required(true)
    .validations([
      {
        in: ['Link', 'Note'],
      },
    ])
    .disabled(false)
    .omitted(false);
  resource
    .createField('title')
    .name('Title')
    .type('Text')
    .localized(false)
    .required(true)
    .validations([])
    .disabled(false)
    .omitted(false);

  resource
    .createField('description')
    .name('Description')
    .type('Text')
    .localized(false)
    .required(true)
    .validations([])
    .disabled(false)
    .omitted(false);

  resource
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

  resource.changeFieldControl('title', 'builtin', 'singleLine', {});
  resource.changeFieldControl('type', 'builtin', 'dropdown', {});
  resource.changeFieldControl('description', 'builtin', 'multiLine', {});
  resource.changeFieldControl('externalLink', 'builtin', 'urlEditor', {
    helpText: 'URL must start with http:// or https://',
  });
};

module.exports.down = (migration) => {
  migration.deleteContentType('projectMembership');
};
