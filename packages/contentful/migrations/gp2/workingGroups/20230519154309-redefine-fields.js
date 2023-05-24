module.exports.description = 'Updates workingGroups';

module.exports.up = (migration) => {
  const workingGroups = migration.editContentType('workingGroups');

  workingGroups.deleteField('projectProposal');
  workingGroups.deleteField('pmEmail');
  workingGroups.deleteField('leadEmail');
  workingGroups.deleteField('keywords');
  workingGroups.deleteField('startDate');
  workingGroups.deleteField('endDate');
  workingGroups.deleteField('status');

  workingGroups.changeFieldControl('members', 'builtin', 'entryLinksEditor', {
    showLinkEntityAction: false,
    showCreateEntityAction: true,
  });
};

module.exports.down = (migration) => {
  const workingGroups = migration.editContentType('workingGroups');
};
