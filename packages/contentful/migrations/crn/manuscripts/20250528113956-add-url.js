module.exports.description = 'Add url to manuscript';

module.exports.up = (migration) => {
  const manuscripts = migration.editContentType('manuscripts');
  manuscripts
    .createField('url')
    .name('URL')
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
  manuscripts.moveField('url').afterField('title');
};

module.exports.down = (migration) => {
  const manuscripts = migration.editContentType('manuscripts');
  manuscripts.deleteField('url');
};
