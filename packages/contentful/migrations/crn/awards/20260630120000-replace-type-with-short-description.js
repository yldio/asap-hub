module.exports.description =
  'Replace awards type with a required short description and reorder fields';

module.exports.up = (migration) => {
  // Depends on the awardType/ migration (which creates awards.awardType) having
  // run first. ctf-migrate orders content-type folders by readdir, not by
  // timestamp across folders, so ensure that migration is applied to the target
  // environment before this one.
  const awards = migration.editContentType('awards');

  awards
    .createField('shortDescription')
    .name('Short description')
    .type('Symbol')
    .localized(false)
    .required(true)
    .validations([])
    .disabled(false)
    .omitted(false);

  awards.changeFieldControl('shortDescription', 'builtin', 'singleLine', {});

  // displayField must move off `type` before it can be deleted, and must be a Symbol
  awards.displayField('shortDescription');

  awards.editField('awardType').required(true);

  awards.moveField('shortDescription').toTheTop();
  awards.moveField('awardType').afterField('shortDescription');
  awards.moveField('date').afterField('awardType');

  awards.deleteField('type');
};

module.exports.down = (migration) => {
  const awards = migration.editContentType('awards');

  awards
    .createField('type')
    .name('Type')
    .type('Symbol')
    .localized(false)
    .required(true)
    .validations([
      {
        in: ['Open Science Champion'],
      },
    ])
    .disabled(false)
    .omitted(false);

  awards.changeFieldControl('type', 'builtin', 'dropdown', {});

  awards.displayField('type');

  awards.editField('awardType').required(false);

  awards.moveField('type').toTheTop();

  awards.deleteField('shortDescription');
};
