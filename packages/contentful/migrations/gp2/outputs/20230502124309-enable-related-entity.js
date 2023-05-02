module.exports.description = 'Enables related entity';

module.exports.up = (migration) => {
  const outputs = migration.editContentType('outputs');

  outputs.editField('relatedEntity').disabled(false);

  outputs.changeFieldControl('relatedEntity', 'builtin', 'entryLinkEditor', {
    showLinkEntityAction: true,
    showCreateEntityAction: false,
  });
};

module.exports.down = (migration) => {
  const outputs = migration.editContentType('outputs');
  outputs.editField('relatedEntity').disabled(true);
};
