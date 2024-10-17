module.exports.description = 'Create messages content model';

module.exports.up = (migration) => {
  const messages = migration
    .createContentType('messages')
    .name('Messages')
    .description('')
    .displayField('text');

  messages
    .createField('text')
    .name('Text')
    .type('Symbol')
    .localized(false)
    .required(true)
    .validations([])
    .disabled(false)
    .omitted(false);

  messages
    .createField('createdBy')
    .name('Created By')
    .type('Link')
    .localized(false)
    .required(true)
    .disabled(false)
    .omitted(false)
    .validations([
      {
        linkContentType: ['users'],
      },
    ])
    .linkType('Entry');

  messages.changeFieldControl('text', 'builtin', 'singleLine', {});
};

module.exports.down = (migration) => {
  migration.deleteContentType('messages');
};
