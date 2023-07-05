module.exports.description = 'update external links validation';

module.exports.up = (migration) => {
  const users = migration.editContentType('users');

  users.editField('linkedin').validations([
    {
      regexp: {
        pattern:
          '^(ftp|http|https):\\/\\/(\\w+:{0,1}\\w*@)?(\\S+)(:[0-9]+)?(\\/|\\/([\\w#!:.?+=&%@!\\-/]))?$',
        flags: null,
      },
    },
  ]);

  users.editField('twitter').validations([
    {
      regexp: {
        pattern:
          '^(ftp|http|https):\\/\\/(\\w+:{0,1}\\w*@)?(\\S+)(:[0-9]+)?(\\/|\\/([\\w#!:.?+=&%@!\\-/]))?$',
        flags: null,
      },
    },
  ]);

  users.editField('github').validations([
    {
      regexp: {
        pattern:
          '^(ftp|http|https):\\/\\/(\\w+:{0,1}\\w*@)?(\\S+)(:[0-9]+)?(\\/|\\/([\\w#!:.?+=&%@!\\-/]))?$',
        flags: null,
      },
    },
  ]);

  users.editField('googleScholar').validations([
    {
      regexp: {
        pattern:
          '^(ftp|http|https):\\/\\/(\\w+:{0,1}\\w*@)?(\\S+)(:[0-9]+)?(\\/|\\/([\\w#!:.?+=&%@!\\-/]))?$',
        flags: null,
      },
    },
  ]);

  users.editField('orcid').validations([
    {
      unique: true,
    },
    {
      regexp: {
        pattern:
          '^(ftp|http|https):\\/\\/(\\w+:{0,1}\\w*@)?(\\S+)(:[0-9]+)?(\\/|\\/([\\w#!:.?+=&%@!\\-/]))?$',
        flags: null,
      },
    },
  ]);

  users.editField('researchGate').validations([
    {
      regexp: {
        pattern:
          '^(ftp|http|https):\\/\\/(\\w+:{0,1}\\w*@)?(\\S+)(:[0-9]+)?(\\/|\\/([\\w#!:.?+=&%@!\\-/]))?$',
        flags: null,
      },
    },
  ]);

  users.editField('researcherId').validations([
    {
      regexp: {
        pattern:
          '^(ftp|http|https):\\/\\/(\\w+:{0,1}\\w*@)?(\\S+)(:[0-9]+)?(\\/|\\/([\\w#!:.?+=&%@!\\-/]))?$',
        flags: null,
      },
    },
  ]);
};

module.exports.down = (migration) => {
  const users = migration.editContentType('users');

  users.editField('linkedin').validations([]);
  users.editField('twitter').validations([]);
  users.editField('github').validations([]);
  users.editField('googleScholar').validations([]);
  users.editField('orcid').validations([
    {
      unique: true,
    },
  ]);
  users.editField('researchGate').validations([]);
  users.editField('researcherId').validations([]);
};
