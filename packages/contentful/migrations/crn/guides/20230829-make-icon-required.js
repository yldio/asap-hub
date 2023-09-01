module.exports.description = 'Make icons required';

module.exports.up = (migration) => {
  const guides = migration.editContentType('guides');
  guides.editField('icon').required(true);
};

module.exports.down = (migration) => {
  const guides = migration.editContentType('guides');
  guides.editField('icon').required(false);
};
