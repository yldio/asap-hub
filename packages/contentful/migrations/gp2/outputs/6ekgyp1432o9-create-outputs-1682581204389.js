module.exports.description = 'Create outputs content models';

module.exports.up = (migration) => {
  const outputs = migration
    .createContentType('outputs')
    .name('Outputs')
    .description('')
    .displayField('title');

  outputs
    .createField('title')
    .name('Title')
    .type('Symbol')
    .localized(false)
    .required(true)
    .validations([
      {
        unique: true,
      },
    ])
    .disabled(false)
    .omitted(false);

  outputs
    .createField('documentType')
    .name('Document type')
    .type('Symbol')
    .localized(false)
    .required(true)
    .validations([
      {
        in: [
          'Procedural_Form',
          'Update',
          'Training_Material',
          'Data_Release',
          'Article',
          'Code_Software',
        ],
      },
    ])
    .disabled(false)
    .omitted(false);

  outputs
    .createField('type')
    .name('Type')
    .type('Symbol')
    .localized(false)
    .required(false)
    .validations([
      {
        in: ['Research', 'Review', 'Letter', 'Hot_Topic', 'Blog'],
      },
    ])
    .disabled(false)
    .omitted(false);

  outputs
    .createField('subtype')
    .name('SubType')
    .type('Symbol')
    .localized(false)
    .required(false)
    .validations([
      {
        in: ['Preprints', 'Published'],
      },
    ])
    .disabled(false)
    .omitted(false);

  outputs
    .createField('addedDate')
    .name('Added Date')
    .type('Date')
    .localized(false)
    .required(true)
    .validations([])
    .disabled(false)
    .omitted(false);

  outputs
    .createField('lastUpdatedPartial')
    .name('Last Updated (partial)')
    .type('Date')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(true)
    .omitted(false);

  outputs
    .createField('createdBy')
    .name('Created by')
    .type('Link')
    .localized(false)
    .required(false)
    .validations([
      {
        linkContentType: ['users'],
      },
    ])
    .disabled(true)
    .omitted(false)
    .linkType('Entry');

  outputs
    .createField('updatedBy')
    .name('Updated by')
    .type('Link')
    .localized(false)
    .required(false)
    .validations([
      {
        linkContentType: ['users'],
      },
    ])
    .disabled(true)
    .omitted(false)
    .linkType('Entry');

  outputs
    .createField('link')
    .name('External Link')
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

  outputs
    .createField('authors')
    .name('Authors')
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
          linkContentType: ['users', 'externalUsers'],
        },
      ],

      linkType: 'Entry',
    });

  outputs
    .createField('relatedEntity')
    .name('Related Entity')
    .type('Link')
    .localized(false)
    .required(true)
    .validations([
      {
        linkContentType: ['projects', 'workingGroups'],
      },
    ])
    .disabled(true)
    .omitted(false)
    .linkType('Entry');

  outputs
    .createField('publishDate')
    .name('Publish Date')
    .type('Date')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);

  outputs
    .createField('adminNotes')
    .name('Admin notes')
    .type('Symbol')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);

  outputs.changeFieldControl('title', 'builtin', 'singleLine', {});
  outputs.changeFieldControl('addedDate', 'builtin', 'datePicker', {
    ampm: '12',
    format: 'timeZ',
    helpText:
      'Date output was shared with GP2 Network (different from publication date)',
  });
  outputs.changeFieldControl('lastUpdatedPartial', 'builtin', 'datePicker', {
    ampm: '12',
    format: 'timeZ',
    helpText: 'Does not include changes to Publish Date and Admin notes',
  });

  outputs.changeFieldControl('link', 'builtin', 'urlEditor', {
    helpText: 'URL must start with http:// or https://',
  });
  outputs.changeFieldControl('publishDate', 'builtin', 'datePicker', {});
  outputs.changeFieldControl('adminNotes', 'builtin', 'singleLine', {
    helpText:
      "This is ASAP internal content and it's not being shown on the Hub",
  });
};

module.exports.down = (migration) => {
  migration.deleteContentType('outputs');
};
