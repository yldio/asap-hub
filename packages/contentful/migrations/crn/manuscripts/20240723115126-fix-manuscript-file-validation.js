module.exports.description = 'Fix manuscript file validation';

module.exports.up = (migration) => {
  const manuscriptVersions = migration.editContentType('manuscriptVersions');

  manuscriptVersions.editField('manuscriptFile').validations([
    {
      linkMimetypeGroup: ['pdfdocument'],
    },
  ]);
};

module.exports.down = (migration) => {
  const manuscriptVersions = migration.editContentType('manuscriptVersions');
  manuscriptVersions.editField('manuscriptFile').validations([
    {
      linkMimetypeGroup: ['application/pdf'],
    },
  ]);
};
