module.exports.description = 'Add help texts copied from Squidex';

module.exports.up = (migration) => {
  const externalAuthors = migration.editContentType('externalAuthors');

  externalAuthors.changeFieldControl('orcid', 'builtin', 'singleLine', {
    helpText: 'ORCIDs cannot be repeated on the Hub',
  });
};

module.exports.down = (migration) => {
  const externalAuthors = migration.editContentType('externalAuthors');
  externalAuthors.changeFieldControl('orcid', 'builtin', 'singleLine', {});
};
