module.exports.description = 'Add guides to dashboard model';

module.exports.up = (migration) => {
  const dashboard = migration.editContentType('dashboard');
  dashboard
    .createField('guides')
    .name('Guides')
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
          linkContentType: ['guide'],
        },
      ],

      linkType: 'Entry',
    });

  dashboard.changeFieldControl('guides', 'builtin', 'entryLinksEditor', {});
};

module.exports.down = (migration) => {
  const dashboard = migration.editContentType('dashboard');
  dashboard.deleteField('guides');
};
