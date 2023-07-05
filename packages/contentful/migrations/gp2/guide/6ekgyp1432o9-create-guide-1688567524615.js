module.exports.description = 'Create guide model';

module.exports.up = (migration) => {
  const guide = migration
    .createContentType('guide')
    .name('Guide')
    .description('Model for Tools and Tutorials guides')
    .displayField('title');
  guide
    .createField('title')
    .name('Title')
    .type('Symbol')
    .localized(false)
    .required(true)
    .validations([])
    .disabled(false)
    .omitted(false);

  guide
    .createField('icon')
    .name('Icon')
    .type('Link')
    .localized(false)
    .required(false)
    .validations([
      {
        linkMimetypeGroup: ['image'],
      },
    ])
    .disabled(false)
    .omitted(false)
    .linkType('Asset');

  guide
    .createField('description')
    .name('Description')
    .type('Array')
    .localized(false)
    .required(true)
    .validations([])
    .disabled(false)
    .omitted(false)
    .items({
      type: 'Link',

      validations: [
        {
          linkContentType: ['guideDescription'],
        },
      ],

      linkType: 'Entry',
    });

  guide.changeFieldControl('title', 'builtin', 'singleLine', {});

  guide.changeFieldControl('icon', 'builtin', 'assetLinkEditor', {
    showLinkEntityAction: true,
    showCreateEntityAction: false,
  });

  guide.changeFieldControl('description', 'builtin', 'entryLinksEditor', {});
};

module.exports.down = (migration) => {
  migration.deleteContentType('guide');
};
