module.exports.description = 'Change lastUpdatedPartial field editor';

module.exports.up = (migration) => {
  const researchOutputs = migration.editContentType('researchOutputs');
  researchOutputs.changeFieldControl(
    'lastUpdatedPartial',
    'app',
    'v97H7wgmtstfxNheYWy0G',
    {
      exclude: 'adminNotes, publishDate',
    },
  );
};

module.exports.down = (migration) => {
  const researchOutputs = migration.editContentType('researchOutputs');
  researchOutputs.changeFieldControl(
    'lastUpdatedPartial',
    'builtin',
    'datePicker',
    {},
  );
};
