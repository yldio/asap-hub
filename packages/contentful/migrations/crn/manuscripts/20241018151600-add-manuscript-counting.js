module.exports.description =
  'Add counting fields for both manuscripts and versions';

module.exports.up = (migration) => {
  const manuscripts = migration.editContentType('manuscripts');
  const manuscriptVersions = migration.editContentType('manuscriptVersions');

  const field = 'count';
  const name = 'Count';
  manuscripts
    .createField(field)
    .name(name)
    .type('Integer')
    .localized(false)
    .required(true)
    .validations([])
    .disabled(false)
    .omitted(false);

  manuscriptVersions
    .createField(field)
    .name(name)
    .type('Integer')
    .localized(false)
    .required(true)
    .validations([])
    .disabled(false)
    .omitted(false);
};

module.exports.down = (migration) => {
  const manuscripts = migration.editContentType('manuscripts');
  const manuscriptVersions = migration.editContentType('manuscriptVersions');

  manuscripts.deleteField('count');
  manuscriptVersions.deleteField('count');
};
