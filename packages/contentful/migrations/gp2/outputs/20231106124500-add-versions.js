module.exports.description =
  'Add version content model and add versions field to outputs';

module.exports.up = function (migration) {
  const outputVersion = migration
    .createContentType('outputVersion')
    .name('Output Version')
    .description('')
    .displayField('title');
  outputVersion
    .createField('title')
    .name('Title')
    .type('Symbol')
    .localized(false)
    .required(true)
    .validations([])
    .disabled(false)
    .omitted(false);

  outputVersion
    .createField('documentType')
    .name('Document Type')
    .type('Symbol')
    .localized(false)
    .required(true)
    .validations([
      {
        in: [
          'Article',
          'Code/Software',
          'Dataset',
          'GP2 Reports',
          'Procedural Form',
          'Training Materials',
        ],
      },
    ])
    .disabled(false)
    .omitted(false);

  outputVersion
    .createField('type')
    .name('Type')
    .type('Symbol')
    .localized(false)
    .required(false)
    .validations([
      {
        in: ['Research', 'Review', 'Letter', 'Hot Topic', 'Blog'],
      },
    ])
    .disabled(false)
    .omitted(false);

  outputVersion
    .createField('addedDate')
    .name('Added Date')
    .type('Date')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);

  outputVersion
    .createField('link')
    .name('Link')
    .type('Symbol')
    .localized(false)
    .required(false)
    .validations([
      {
        unique: true,
      },
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

  outputVersion.changeFieldControl('title', 'builtin', 'singleLine', {});
  outputVersion.changeFieldControl('documentType', 'builtin', 'singleLine', {});
  outputVersion.changeFieldControl('type', 'builtin', 'singleLine', {});
  outputVersion.changeFieldControl('addedDate', 'builtin', 'datePicker', {});
  outputVersion.changeFieldControl('link', 'builtin', 'singleLine', {});

  const outputs = migration.editContentType('outputs');

  outputs
    .createField('versions')
    .name('Versions')
    .type('Array')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false)
    .items({
      type: 'Link',

      validations: [
        {
          linkContentType: ['outputVersion'],
        },
      ],

      linkType: 'Entry',
    });

  outputs.changeFieldControl('versions', 'builtin', 'entryLinksEditor', {});
};

module.exports.down = function (migration) {
  const researchOutputs = migration.editContentType('outputs');
  researchOutputs.deleteField('versions');
  migration.deleteContentType('outputVersion');
};
