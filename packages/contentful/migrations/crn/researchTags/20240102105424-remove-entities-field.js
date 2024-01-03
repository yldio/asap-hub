module.exports.description = 'Remove field entities from researchTags';

module.exports.up = (migration) => {
  const researchTags = migration.editContentType('researchTags');
  researchTags.deleteField('entities');
};

module.exports.down = (migration) => {
  const researchTags = migration.editContentType('researchTags');
  researchTags
    .createField('entities')
    .name('Entities')
    .type('Array')
    .localized(false)
    .required(false)
    .disabled(false)
    .omitted(false)
    .items({
      type: 'Symbol',
      validations: [
        {
          in: ['Research Output', 'User'],
        },
      ],
    });
  researchTags.changeFieldControl('entities', 'builtin', 'checkbox', {});
};
