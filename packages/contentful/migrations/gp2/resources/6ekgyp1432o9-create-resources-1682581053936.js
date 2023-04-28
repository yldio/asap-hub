module.exports.description = 'Create resources content model';

module.exports.up = function (migration) {
  const resources = migration
    .createContentType('resources')
    .name('Resources')
    .description('')
    .displayField('title');

  resources
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
  resources
    .createField('title')
    .name('Title')
    .type('Symbol')
    .localized(false)
    .required(true)
    .validations([])
    .disabled(false)
    .omitted(false);

  resources
    .createField('description')
    .name('Description')
    .type('Symbol')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);

  resources
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

  resources.changeFieldControl('title', 'builtin', 'singleLine', {});
  resources.changeFieldControl('type', 'builtin', 'dropdown', {});
  resources.changeFieldControl('description', 'builtin', 'singleLine', {});

  resources.changeFieldControl('externalLink', 'builtin', 'urlEditor', {
    helpText: 'URL must start with http:// or https://',
  });
};

module.exports.down = (migration) => {
  migration.deleteContentType('resources');
};
