module.exports.description =
  'Add description, gp2funded and sharing status fields, re-order fields and add help text to publishDate';

module.exports.up = (migration) => {
  const outputs = migration.editContentType('outputs');

  outputs
    .createField('description')
    .name('Description')
    .type('Text')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);

  outputs
    .createField('gp2Supported')
    .name('GP2 Supported')
    .type('Symbol')
    .localized(false)
    .required(true)
    .validations([
      {
        in: ['Yes', 'No', "Don't Know"],
      },
    ])
    .disabled(false)
    .omitted(false);

  outputs
    .createField('sharingStatus')
    .name('Sharing Status')
    .type('Symbol')
    .localized(false)
    .required(true)
    .validations([
      {
        in: ['Public', 'GP2 Only'],
      },
    ])
    .disabled(false)
    .omitted(false);

  outputs.changeFieldControl('description', 'builtin', 'markdown', {});
  outputs.changeFieldControl('gp2Supported', 'builtin', 'dropdown', {
    helpText: 'Has this output been supported by GP2?',
  });
  outputs.changeFieldControl('sharingStatus', 'builtin', 'dropdown', {});

  outputs.moveField('createdBy').afterField('addedDate');
  outputs.moveField('lastUpdatedPartial').afterField('createdBy');
  outputs.moveField('updatedBy').afterField('lastUpdatedPartial');
  outputs.moveField('title').afterField('updatedBy');
  outputs.moveField('link').afterField('title');
  outputs.moveField('documentType').afterField('link');
  outputs.moveField('type').afterField('documentType');
  outputs.moveField('subtype').afterField('type');
  outputs.moveField('description').afterField('subtype');
  outputs.moveField('gp2Supported').afterField('description');
  outputs.moveField('sharingStatus').afterField('gp2Supported');
  outputs.moveField('publishDate').afterField('sharingStatus');
  outputs.moveField('tags').afterField('publishDate');
  outputs.moveField('authors').afterField('tags');
  outputs.moveField('relatedEntity').afterField('authors');
  outputs.moveField('adminNotes').afterField('relatedEntity');

  outputs.changeFieldControl('publishDate', 'builtin', 'datePicker', {
    ampm: '24',
    format: 'timeZ',
    helpText:
      'This should be the date your output was shared publicly on its repository',
  });
};

module.exports.down = (migration) => {
  const outputs = migration.editContentType('outputs');
  outputs.deleteField('description');
  outputs.deleteField('gp2Supported');
  outputs.deleteField('sharingStatus');
};
