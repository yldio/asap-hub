module.exports.description =
  'Adds validation to social media urls on the users';

module.exports.up = (migration) => {
  const users = migration.editContentType('users');

  users.editField('linkedIn').validations([
    {
      regexp: {
        pattern: '^https:\\/\\/(www\\.)?linkedin\\.com\\/in\\/[\\w\\-]+\\/?$',
        flags: null,
      },
      message:
        'Please enter a valid LinkedIn URL. (e.g. https://www.linkedin.com/in/addyourname)',
    },
  ]);

  users.editField('twitter').validations([
    {
      regexp: {
        pattern: '^https:\\/\\/(www\\.)?twitter\\.com\\/[\\w\\d_]+\\/?$',
        flags: null,
      },
      message:
        'Please enter a valid Twitter URL. (e.g. https://twitter.com/addyourname)',
    },
  ]);

  users.editField('github').validations([
    {
      regexp: {
        pattern: '^https:\\/\\/(www\\.)?github\\.com\\/[\\w\\d\\-]+\\/?$',
        flags: null,
      },
      message:
        'Please enter a valid Github URL. (e.g. https://github.com/addyourname)',
    },
  ]);

  users.editField('googleScholar').validations([
    {
      regexp: {
        pattern:
          '^https:\\/\\/scholar\\.google\\.com\\/citations\\?user=[\\w\\d\\-_]+',
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
          '^https:\\/\\/orcid\\.org\\/\\d{4}-\\d{4}-\\d{4}-\\d{3}[0-9X]\\/?$',
        flags: null,
      },
      message:
        'Please enter a valid ORCID URL. (e.g. https://orcid.org/0000-000X-XXXX-XXXX)',
    },
  ]);

  users.editField('researchGate').validations([
    {
      regexp: {
        pattern:
          '^https:\\/\\/(www\\.)?researchgate\\.net\\/profile\\/[\\w\\d\\-_]+\\/?$',
        flags: null,
      },
      message:
        'Please enter a valid ResearchGate URL. (e.g. https://www.researchgate.net/profile/addyourname)',
    },
  ]);

  users.editField('researcherId').validations([
    {
      regexp: {
        pattern:
          '^(http|https):\\/\\/(\\w+:{0,1}\\w*@)?(\\S+)(:[0-9]+)?(\\/|\\/([\\w#!:.?+=&%@!\\-/]))?$',
        flags: null,
      },
      message: 'This is the custom error 2',
    },
  ]);

  users.changeFieldControl('linkedIn', 'builtin', 'singleLine', {
    helpText: 'Please add the users full LinkedIn URL',
  });
  users.changeFieldControl('twitter', 'builtin', 'singleLine', {
    helpText: 'Please add the users full Twitter URL',
  });
  users.changeFieldControl('github', 'builtin', 'singleLine', {
    helpText: 'Please add the users full Github URL',
  });
  users.changeFieldControl('googleScholar', 'builtin', 'singleLine', {
    helpText: 'Please add the users full Google Scholar URL',
  });
  users.changeFieldControl('orcid', 'builtin', 'singleLine', {
    helpText: 'Please add the users full ORCID',
  });
  users.changeFieldControl('researchGate', 'builtin', 'singleLine', {
    helpText: 'Please add the users full Research Gate URL',
  });
};

module.exports.down = (migration) => {
  const users = migration.editContentType('users');

  users.editField('linkedIn').validations([]);
  users.changeFieldControl('linkedIn', 'builtin', 'singleLine', {
    helpText: '',
  });
  users.editField('twitter').validations([]);
  users.changeFieldControl('twitter', 'builtin', 'singleLine', {
    helpText: '',
  });
  users.editField('github').validations([]);
  users.changeFieldControl('github', 'builtin', 'singleLine', {
    helpText: '',
  });
  users.editField('googleScholar').validations([]);
  users.changeFieldControl('googleScholar', 'builtin', 'singleLine', {
    helpText: '',
  });
  users.editField('orcid').validations([
    {
      unique: true,
    },
  ]);
  users.changeFieldControl('orcid', 'builtin', 'singleLine', {
    helpText: '',
  });
  users.editField('researchGate').validations([]);
  users.changeFieldControl('researchGate', 'builtin', 'singleLine', {
    helpText: '',
  });
  users.editField('researcherId').validations([]);

  users.changeFieldControl('researcherId', 'builtin', 'singleLine', {});
};
