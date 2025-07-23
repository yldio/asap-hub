module.exports.description =
  'Add preliminary data shared and attendance fields';

module.exports.up = (migration) => {
  const events = migration.editContentType('events');

  events
    .createField('preliminaryDataShared')
    .name('Preliminary Data Shared')
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
          linkContentType: ['preliminaryDataSharing'],
        },
      ],

      linkType: 'Entry',
    });

  events
    .createField('attendance')
    .name('Attendance')
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
          linkContentType: ['attendance'],
        },
      ],

      linkType: 'Entry',
    });

  events.changeFieldControl(
    'preliminaryDataShared',
    'app',
    'Yp64pYYDuRNHdvAAAJPYa',
    {
      entityName: 'team',
      bulkEditing: false,
      showUserEmail: false,
      booleanFieldName: 'preliminaryDataShared',
      showLinkEntityAction: false,
      showCreateEntityAction: true,
    },
  );

  events.changeFieldControl('attendance', 'app', 'Yp64pYYDuRNHdvAAAJPYa', {
    entityName: 'team',
    bulkEditing: false,
    showUserEmail: false,
    booleanFieldName: 'attended',
    showLinkEntityAction: false,
    showCreateEntityAction: true,
  });
};

module.exports.down = (migration) => {
  const events = migration.editContentType('events');
  events.deleteField('preliminaryDataShared');
  events.deleteField('attendance');
};
