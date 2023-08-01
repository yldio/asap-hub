module.exports.description = 'Add tags to users content model';

module.exports.up = (migration) => {
  const users = migration.editContentType('users');

  users
    .createField("tags")
    .name("Tags")
    .type("Array")
    .localized(false)
    .required(false)
    .validations([
      {
        size: {
          min: 1,
          max: 10,
        },
      },
    ])
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

  users.moveField('tags').afterField('keywords');
};

module.exports.down = (migration) => {
  migration.editContentType('users').deleteField('tags');
};
