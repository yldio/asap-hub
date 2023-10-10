module.exports.description = 'disable legacy description field';

module.exports.up = (migration) => {
  const researchOutputs = migration.editContentType('researchOutputs');
  researchOutputs.changeFieldControl(
    'description',
    'app',
    '2finDNk15g5UtOq4DaLNxv',
    {},
  );
};

module.exports.down = (migration) => {
  const researchOutputs = migration.editContentType('researchOutputs');
  researchOutputs.changeFieldControl(
    'description',
    'builtin',
    'richTextEditor',
    {},
  );
};
