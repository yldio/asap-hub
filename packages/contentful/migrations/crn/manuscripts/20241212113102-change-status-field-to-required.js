module.exports.description = 'Change status to required';

module.exports.up = function (migration) {
  const manuscripts = migration.editContentType('manuscripts');
  manuscripts.editField('status').required(true);
};

module.exports.down = (migration) => {
  const manuscripts = migration.editContentType('manuscripts');
  manuscripts.editField('status').required(false);
};
