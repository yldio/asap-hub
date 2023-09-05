module.exports.description = 'Add help texts copied from Squidex';

module.exports.up = (migration) => {
  const users = migration.editContentType('users');

  users.changeFieldControl('biography', 'builtin', 'multipleLine', {
    helpText: 'This data shows up in the second tab',
  });

  users.changeFieldControl('adminNotes', 'builtin', 'multipleLine', {
    helpText:
      "This is ASAP internal content and it's not being shown on the Hub",
  });

  users.changeFieldControl('onboarded', 'builtin', 'boolean', {
    helpText:
      'Use this to allow the user to see the full Hub and skip profile completion',
    trueLabel: 'Yes',
    falseLabel: 'No',
  });

  users.changeFieldControl('teams', 'app', 'Yp64pYYDuRNHdvAAAJPYa', {
    helpText:
      'Mandatory for grantees. They cannot publish profile without a team.',
    entityName: 'team',
    showUserEmail: false,
  });

  users.changeFieldControl('labs', 'builtin', 'entryLinksEditor', {
    helpText:
      'Mandatory for grantees. They cannot publish profile without a lab.',
    bulkEditing: false,
    showLinkEntityAction: true,
    showCreateEntityAction: true,
  });
};

module.exports.down = (migration) => {
  const users = migration.editContentType('users');

  users.changeFieldControl('biography', 'builtin', 'multipleLine', {});

  users.changeFieldControl('adminNotes', 'builtin', 'multipleLine', {});

  users.changeFieldControl('onboarded', 'builtin', 'boolean', {});

  users.changeFieldControl('teams', 'app', 'Yp64pYYDuRNHdvAAAJPYa', {
    entityName: 'team',
  });
  users.changeFieldControl('labs', 'builtin', 'entryLinksEditor', {});
};
