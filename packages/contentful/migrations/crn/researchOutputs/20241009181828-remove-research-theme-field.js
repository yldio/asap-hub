module.exports.description = 'Removes research theme field';

module.exports.up = (migration) => {
  const researchOutputs = migration.editContentType('researchOutputs');
  researchOutputs.deleteField('researchTheme');
};

module.exports.down = (migration) => {
  const researchOutputs = migration.editContentType('researchOutputs');

  researchOutputs
    .createField('researchTheme')
    .name('Research Theme')
    .type('Array')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false)
    .items({
      type: 'Symbol',
      validations: [],
    });

  researchOutputs.changeFieldControl(
    'researchTheme',
    'builtin',
    'tagEditor',
    {},
  );
  researchOutputs.moveField('researchTheme').afterField('tags');
};
