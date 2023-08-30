module.exports.description = 'Add members validation field';

module.exports.up = (migration) => {
  const events = migration.editContentType('workingGroups');

  events
    .createField('validation')
    .name('Validation')
    .type('Symbol')
    .localized(false)
    .required(false)
    .validations([
      {
        in: ['true', 'false'],
      },
    ])
    .defaultValue({
      'en-US': 'true',
    })
    .disabled(false)
    .omitted(true);

  events.moveField('validation').afterField('members');

  events.changeFieldControl('validation', 'app', '38OtgO2lFDLM9gyf5Bs4XZ', {});
};

module.exports.down = (migration) => {
  const workingGroups = migration.editContentType('workingGroups');
  events.deleteField('validation');
};
