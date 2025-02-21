module.exports.description = 'Makes title field of Manuscripts unique';

module.exports.up = (migration) => {
  const manuscripts = migration.editContentType('manuscripts');
  manuscripts.editField('title').validations([{ unique: true }]);
};

module.exports.down = (migration) => {
  const manuscripts = migration.editContentType('manuscripts');
  manuscripts.editField('title').validations([]);
};
