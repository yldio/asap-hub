module.exports.description = 'Add Date first made public and Lay Impact Statement fields';

module.exports.up = (migration) => {
  const manuscripts = migration.editContentType('manuscripts');

    manuscripts
    .createField('layImpactStatement')
    .name('Lay Impact Statement')
    .type('Text')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);

  manuscripts
    .createField('firstPublicDate')
    .name('Date first made public')
    .type('Date')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);

  manuscripts.moveField('layImpactStatement').afterField('impact');
};

module.exports.down = (migration) => {
  const manuscripts = migration.editContentType('manuscripts');
  manuscripts.deleteField('layImpactStatement');
  manuscripts.deleteField('firstPublicDate');
};
