module.exports.description = 'Change working groups deliverables editor';

module.exports.up = (migration) => {
  const workingGroups = migration.editContentType('workingGroups');
  workingGroups.changeFieldControl(
    'deliverables',
    'app',
    '2hc2UiWrW8SFhfkKMmGtk9',
    {},
  );
};

module.exports.down = (migration) => {
  const workingGroups = migration.editContentType('workingGroups');
  workingGroups.changeFieldControl(
    'deliverables',
    'builtin',
    'entryLinksEditor',
    {},
  );
};
