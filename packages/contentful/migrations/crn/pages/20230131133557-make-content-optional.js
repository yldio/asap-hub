module.exports.description = 'Make Page content optional';

module.exports.up = (migration) => {
  const pages = migration.editContentType('pages');

  pages.editField('text').required(false);
};

module.exports.down = (migration) => {
  pages.editField('text').required(true);
};
