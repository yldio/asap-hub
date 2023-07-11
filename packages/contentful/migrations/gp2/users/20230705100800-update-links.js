module.exports.description = 'update external links validation';

module.exports.up = (migration) => {
  const users = migration.editContentType('users');

  users.editField('linkedIn').validations([
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

  users.changeFieldControl('orcid', 'builtin', 'urlEditor', {
    helpText:
      'ORCID url should follow the pattern: https://orcid.org/<ORCID>. ORCID must have the following format: 0000-0000-0000-0000',
  });

  users.changeFieldControl('researchGate', 'builtin', 'urlEditor', {
    helpText:
      'Research Gate should follow the pattern https://researchid.com/rid/<id>',
  });

  users.changeFieldControl('researcherId', 'builtin', 'urlEditor', {
    helpText:
      'Research ID should follow the pattern https://researcherid.com/rid/<ResearcherID> . ResearcherID must have the following format: R-0000-0000',
  });
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

  users.changeFieldControl('orcid', 'builtin', 'singleLine', {});
  users.changeFieldControl('researchGate', 'builtin', 'singleLine', {});
  users.changeFieldControl('researcherId', 'builtin', 'singleLine', {});
};
