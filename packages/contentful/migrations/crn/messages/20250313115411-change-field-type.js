module.exports.description = 'Change text field type to Text';

module.exports.up = (migration) => {
  const messages = migration.editContentType('messages');
  messages
    .createField('text_new')
    .name('Text')
    .type('Text')
    .localized(false)
    .required(true)
    .validations([])
    .disabled(false)
    .omitted(false);
  messages.moveField('text_new').toTheTop();

  messages.displayField('text_new');
  messages.deleteField('text');
  messages.changeFieldId('text_new', 'text');
};

module.exports.down = (migration) => {
  const messages = migration.editContentType('messages');
  messages
    .createField('text_old')
    .name('Text')
    .type('Symbol')
    .localized(false)
    .required(true)
    .validations([])
    .disabled(false)
    .omitted(false);
  messages.displayField('text_old');
  messages.deleteField('text');
  messages.changeFieldId('text_old', 'text');
};
