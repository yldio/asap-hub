module.exports.description = 'Add tags field';

module.exports.up = (migration) => {
  const workingGroups = migration.editContentType('workingGroups');
  workingGroups
    .createField('tags')
    .name('Tags')
    .type('Array')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false)
    .items({
      type: 'Link',

      validations: [
        {
          linkContentType: ['researchTags'],
        },
      ],

      linkType: 'Entry',
    });
  workingGroups.moveField('tags').afterField('deliverables');
};

module.exports.down = (migration) => {
  const workingGroups = migration.editContentType('workingGroups');
  workingGroups.deleteField('tags');
};
