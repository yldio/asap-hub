module.exports.description = 'Create milestones content model';

module.exports.up = function (migration) {
  const milestones = migration
    .createContentType('milestones')
    .name('Milestones')
    .description('')
    .displayField('title');

  milestones
    .createField('title')
    .name('Title')
    .type('Symbol')
    .localized(false)
    .required(true)
    .validations([])
    .disabled(false)
    .omitted(false);

  milestones
    .createField('description')
    .name('Description')
    .type('Symbol')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);

  milestones
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

  milestones
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

  milestones.changeFieldControl('title', 'builtin', 'singleLine', {});
  milestones.changeFieldControl('status', 'builtin', 'dropdown', {});
  milestones.changeFieldControl('description', 'builtin', 'singleLine', {});

  milestones.changeFieldControl('externalLink', 'builtin', 'urlEditor', {
    helpText: 'URL must start with http:// or https://',
  });
};

module.exports.down = (migration) => {
  migration.deleteContentType('milestones');
};
