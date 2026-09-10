// The event-attendance app is a dedicated field editor forked from the shared
// membership-reference app. Replace EVENT_ATTENDANCE_APP_ID with the app
// definition id returned by `contentful-app-scripts upload` for the
// event-attendance extension before running this migration.
const EVENT_ATTENDANCE_APP_ID = 'REPLACE_WITH_EVENT_ATTENDANCE_APP_ID';
const MEMBERSHIP_REFERENCE_APP_ID = 'Yp64pYYDuRNHdvAAAJPYa';

const controlSettings = {
  entityName: 'team',
  bulkEditing: false,
  showUserEmail: false,
  booleanFieldName: 'attended',
  showLinkEntityAction: false,
  showCreateEntityAction: true,
};

module.exports.description =
  'Point event attendance field control to the event-attendance app';

module.exports.up = (migration) => {
  const events = migration.editContentType('events');
  events.changeFieldControl(
    'attendance',
    'app',
    EVENT_ATTENDANCE_APP_ID,
    controlSettings,
  );
};

module.exports.down = (migration) => {
  const events = migration.editContentType('events');
  events.changeFieldControl(
    'attendance',
    'app',
    MEMBERSHIP_REFERENCE_APP_ID,
    controlSettings,
  );
};
