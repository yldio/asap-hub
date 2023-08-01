module.exports.description = 'Add tags to workingGroups content model';

module.exports.up = (migration) => {
  const workingGroups = migration.editContentType('workingGroups');

  workingGroups
    .createField("tags")
    .name("Tags")
    .type("Array")
    .localized(false)
    .required(false)
    .validations([])
    .disabled(true)
    .omitted(false)
    .items({
      type: "Link",

      validations: [
        {
          linkContentType: ["keywords"],
        },
      ],

      linkType: "Entry",
    });

  workingGroups.moveField('tags').afterField('keywords');
};

module.exports.down = (migration) => {
  migration.editContentType('workingGroups').deleteField('tags');
};
