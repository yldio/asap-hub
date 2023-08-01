module.exports.description = 'Add keywords to events content model';

module.exports.up = (migration) => {
  const events = migration.editContentType('events');

  events
    .createField("keywords")
    .name("Keywords")
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

  events.moveField('keywords').afterField('tags');
};

module.exports.down = (migration) => {
  migration.editContentType('events').deleteField('keywords');
};
