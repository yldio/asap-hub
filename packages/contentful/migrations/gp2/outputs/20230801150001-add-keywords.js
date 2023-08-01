module.exports.description = 'Add tags to outputs content model';

module.exports.up = (migration) => {
  const outputs = migration.editContentType('outputs');

  outputs
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

  outputs.moveField('tags').afterField('keywords');
};

module.exports.down = (migration) => {
  migration.editContentType('outputs').deleteField('tags');
};
