module.exports.description = 'Update twitter and add BlueSky and Threads';

module.exports.up = (migration) => {
  const users = migration.editContentType('users');

  users.editField('twitter').name('X');

  users
    .createField('blueSky')
    .name('BlueSky')
    .type('Symbol')
    .localized(false)
    .required(false)
    .validations([
      {
        regexp: {
          pattern:
            '^(ftp|http|https):\\/\\/(\\w+:{0,1}\\w*@)?(\\S+)(:[0-9]+)?(\\/|\\/([\\w#!:.?+=&%@!\\-/]))?$',
          flags: null,
        },
      },
    ])
    .disabled(false)
    .omitted(false);

  users.moveField('blueSky').afterField('blog');

  users
    .createField('threads')
    .name('Threads')
    .type('Symbol')
    .localized(false)
    .required(false)
    .validations([
      {
        regexp: {
          pattern:
            '^(ftp|http|https):\\/\\/(\\w+:{0,1}\\w*@)?(\\S+)(:[0-9]+)?(\\/|\\/([\\w#!:.?+=&%@!\\-/]))?$',
          flags: null,
        },
      },
    ])
    .disabled(false)
    .omitted(false);

  users.moveField('threads').afterField('blueSky');

  users.changeFieldControl('twitter', 'builtin', 'singleLine', {
    helpText: 'Formerly twitter',
  });
};

module.exports.down = (migration) => {
  const users = migration.editContentType('users');

  users.editField('twitter').name('Twitter').description('');
  users.deleteField('blueSky');
  users.deleteField('threads');
};
