module.exports.description = 'Create dashboard content model';

module.exports.up = function (migration) {
  const dashboard = migration
    .createContentType('dashboard')
    .name('Dashboard')
    .description('');

  dashboard
    .createField('latestStats')
    .name('Latest Stats')
    .type('Link')
    .localized(false)
    .required(true)
    .validations([
      {
        linkContentType: ['latestStats'],
      },
    ])
    .disabled(false)
    .omitted(false)
    .linkType('Entry');

  dashboard
    .createField('announcements')
    .name('Announcements')
    .type('Array')
    .localized(false)
    .required(false)
    .validations([
      {
        size: {
          max: 10,
        },
      },
    ])
    .disabled(false)
    .omitted(false)
    .items({
      type: 'Link',

      validations: [
        {
          linkContentType: ['announcements'],
        },
      ],

      linkType: 'Entry',
    });

  dashboard.changeFieldControl('latestStats', 'builtin', 'entryLinkEditor', {});
  dashboard.changeFieldControl(
    'announcements',
    'builtin',
    'entryLinksEditor',
    {},
  );
};

module.exports.down = (migration) => {
  migration.deleteContentType('dashboard');
};
