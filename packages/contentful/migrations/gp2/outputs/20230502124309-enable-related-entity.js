module.exports.description = 'Enables related entity';

module.exports.up = (migration) => {
  const outputs = migration.editContentType('outputs');

  outputs.editField('relatedEntity').disabled(false);
  outputs.editField('lastUpdatedPartial').disabled(false);
  outputs.editField('createdBy').disabled(false);
  outputs.editField('updatedBy').disabled(false);

  outputs.changeFieldControl('relatedEntity', 'builtin', 'entryLinkEditor', {
    showLinkEntityAction: true,
    showCreateEntityAction: false,
  });
  outputs.changeFieldControl(
    'lastUpdatedPartial',
    'app',
    'mqvX9KU5AthRTlnIRhNNh',
    {
      observedField: 'lastUpdatedPartial',
    },
  );
  outputs.changeFieldControl('createdBy', 'app', '2finDNk15g5UtOq4DaLNxv', {});
  outputs.changeFieldControl('updatedBy', 'app', '2finDNk15g5UtOq4DaLNxv', {});
};

module.exports.down = (migration) => {
  const outputs = migration.editContentType('outputs');
  outputs.editField('relatedEntity').disabled(true);
};
