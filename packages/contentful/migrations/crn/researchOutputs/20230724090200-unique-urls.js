module.exports.description = 'Remove uniqueness constraint on link field';

module.exports.up = function (migration) {
  const researchOutputs = migration.editContentType('researchOutputs');

  researchOutputs.editField('link').validations([
    {
      regexp: {
        pattern:
          '^(ftp|http|https):\\/\\/(\\w+:{0,1}\\w*@)?(\\S+)(:[0-9]+)?(\\/|\\/([\\w#!:.?+=&%@!\\-/]))?$',
        flags: null,
      },
    },
  ]);
};

module.exports.down = (migration) => {};
