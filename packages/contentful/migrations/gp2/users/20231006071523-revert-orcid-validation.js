module.exports.description =
  'Change ORCID field validation pattern to allow only the ORCID number';

module.exports.up = (migration) => {
  const users = migration.editContentType('users');
  users.editField('orcid').validations([
    {
      unique: true,
    },
    {
      regexp: {
        pattern: '^\\d{4}-\\d{4}-\\d{4}-\\d{3}(\\d|X)$',
        flags: null,
      },

      message: 'ORCID must have the following format: 0000-0000-0000-0000',
    },
  ]);
};

module.exports.down = (migration) => {
  const users = migration.editContentType('users');
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
};
