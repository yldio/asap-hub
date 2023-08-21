module.exports.description = 'Remove keywords from outputs content model';

module.exports.up = (migration) => {
  const outputs = migration.editContentType('outputs');

  outputs.editField('tags').disabled(false);
};

module.exports.down = (migration) => {
  const outputs = migration.editContentType('outputs');
  outputs.editField('tags').disabled(true);
};
