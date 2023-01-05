module.exports.description = 'Create Dasahboard content model.';

module.exports.up = function (migration) {
  const dashboard = migration
    .createContentType('dashboard')
    .name('Dashboard')
    .description('');

  dashboard
    .createField('news')
    .name('News')
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
          linkContentType: ['news'],
        },
      ],

      linkType: 'Entry',
    });

  dashboard
    .createField('pages')
    .name('Pages')
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
          linkContentType: ['pages'],
        },
      ],

      linkType: 'Entry',
    });

  dashboard.changeFieldControl('news', 'builtin', 'entryLinksEditor', {
    helpText: 'Latest News from ASAP',
    bulkEditing: false,
    showLinkEntityAction: true,
    showCreateEntityAction: false,
  });

  dashboard.changeFieldControl('pages', 'builtin', 'entryLinksEditor', {
    helpText: 'Where to Start',
    bulkEditing: false,
    showLinkEntityAction: true,
    showCreateEntityAction: false,
  });
};

module.exports.down = (migration) => migration.deleteContentType('dashboard');
