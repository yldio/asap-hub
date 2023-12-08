module.exports.description = '<Put your description here>';

module.exports.up = (migration) => {
  const announcements = migration
    .createContentType('announcements')
    .name('Announcements')
    .description('')
    .displayField('description');
  announcements
    .createField('description')
    .name('Description')
    .type('Symbol')
    .localized(false)
    .required(true)
    .validations([])
    .disabled(false)
    .omitted(false);
  announcements
    .createField('deadline')
    .name('Deadline')
    .type('Date')
    .localized(false)
    .required(true)
    .validations([])
    .disabled(false)
    .omitted(false);
  announcements
    .createField('link')
    .name('Link')
    .type('Symbol')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);
  announcements.changeFieldControl('description', 'builtin', 'singleLine', {});
  announcements.changeFieldControl('deadline', 'builtin', 'datePicker', {});
  announcements.changeFieldControl('link', 'builtin', 'urlEditor', {});

  const dashboard = migration.editContentType('dashboard');
  dashboard
    .createField('announcements')
    .name('Announcements')
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
          linkContentType: ['announcements'],
        },
      ],

      linkType: 'Entry',
    });

  dashboard.changeFieldControl(
    'announcements',
    'builtin',
    'entryLinksEditor',
    {},
  );
};

module.exports.down = (migration) => {
  const dashboard = migration.editContentType('dashboard');
  dashboard.deleteField('announcements');

  migration.deleteContentType('announcements');
};
