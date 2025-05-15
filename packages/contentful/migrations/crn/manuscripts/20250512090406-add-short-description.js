module.exports.description = 'Add short description field';

module.exports.up = (migration) => {
  const manuscriptVersions = migration.editContentType('manuscriptVersions');

  manuscriptVersions
    .createField('shortDescription')
    .name('Short Description')
    .type('Text')
    .localized(false)
    .required(false)
    .validations([
      {
        size: {
          min: null,
          max: 250,
        },
      },
    ])
    .disabled(false)
    .omitted(false);

  manuscriptVersions.changeFieldControl(
    'shortDescription',
    'builtin',
    'singleLine',
    {},
  );
  manuscriptVersions.moveField('shortDescription').afterField('description');
};

module.exports.down = (migration) => {
  const manuscriptVersions = migration.editContentType('manuscriptVersions');
  manuscriptVersions.deleteField('shortDescription');
};
