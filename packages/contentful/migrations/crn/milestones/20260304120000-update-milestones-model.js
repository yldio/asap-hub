module.exports.description = 'Update milestones content model';

module.exports.up = (migration) => {
  const milestones = migration.editContentType('milestones');

  milestones
    .createField('description_new')
    .name('Description')
    .type('Text')
    .localized(false)
    .required(true)
    .validations([
      {
        size: { max: 750 },
        message: 'Description cannot exceed 750 characters.',
      },
    ])
    .disabled(false)
    .omitted(false);

  milestones.displayField('description_new');
  milestones.deleteField('description');
  milestones.changeFieldId('description_new', 'description');
  milestones.displayField('description'); // required or otherwise the next operations fail in dry:run

  milestones.deleteField('title');
  milestones.deleteField('externalLink');

  milestones.editField('status').validations([
    {
      in: ['Pending', 'In Progress', 'Complete', 'Terminated'],
    },
  ]);

  milestones
    .createField('relatedArticles')
    .name('Related Articles')
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
          linkContentType: ['researchOutputs'],
        },
      ],
      linkType: 'Entry',
    });

  milestones.changeFieldControl('description', 'builtin', 'multipleLine', {});
  milestones.changeFieldControl(
    'relatedArticles',
    'builtin',
    'entryLinksEditor',
    {
      showLinkEntityAction: true,
      showCreateEntityAction: false,
    },
  );
};

module.exports.down = (migration) => {
  const milestones = migration.editContentType('milestones');

  milestones.deleteField('relatedArticles');

  milestones.editField('status').validations([
    {
      in: ['Complete', 'In Progress', 'Pending', 'Incomplete', 'Not Started'],
    },
  ]);

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
    .createField('description_old')
    .name('Description')
    .type('Symbol')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);

  milestones.displayField('title');
  milestones.deleteField('description');
  milestones.changeFieldId('description_old', 'description');

  milestones.changeFieldControl('title', 'builtin', 'singleLine', {});
  milestones.changeFieldControl('description', 'builtin', 'singleLine', {});
  milestones.changeFieldControl('externalLink', 'builtin', 'urlEditor', {
    helpText: 'URL must start with http:// or https://',
  });
};
