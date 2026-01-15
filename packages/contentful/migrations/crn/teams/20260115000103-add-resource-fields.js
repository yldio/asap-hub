module.exports.description = 'Add resource fields to teams content model';

module.exports.up = (migration) => {
  const teams = migration.editContentType('teams');

  teams
    .createField('resourceTitle')
    .name('Resource Title')
    .type('Symbol')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);

  teams
    .createField('resourceDescription')
    .name('Resource Description')
    .type('Text')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);

  teams
    .createField('resourceButtonCopy')
    .name('Resource Button Copy')
    .type('Symbol')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);

  teams
    .createField('resourceContactEmail')
    .name('Resource Contact Email')
    .type('Symbol')
    .localized(false)
    .required(false)
    .validations([
      {
        regexp: {
          pattern:
            "^[a-zA-Z0-9.!#$%&'*+\\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$",
          flags: null,
        },
      },
    ])
    .disabled(false)
    .omitted(false);

  teams
    .createField('resourceLink')
    .name('Resource Link')
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

  // Set up field controls for better UX in Contentful
  teams.changeFieldControl('resourceTitle', 'builtin', 'singleLine', {
    helpText:
      '⚠️ If you fill any Resource field (Title, Description, Button Copy, or Contact Email), please fill all of them. Resource Link is optional.',
  });
  teams.changeFieldControl(
    'resourceDescription',
    'builtin',
    'multipleLine',
    {
      helpText:
        '⚠️ If you fill any Resource field (Title, Description, Button Copy, or Contact Email), please fill all of them. Resource Link is optional.',
    },
  );
  teams.changeFieldControl('resourceButtonCopy', 'builtin', 'singleLine', {
    helpText:
      '⚠️ If you fill any Resource field (Title, Description, Button Copy, or Contact Email), please fill all of them. Resource Link is optional.',
  });
  teams.changeFieldControl('resourceContactEmail', 'builtin', 'singleLine', {
    helpText:
      '⚠️ If you fill any Resource field (Title, Description, Button Copy, or Contact Email), please fill all of them. Resource Link is optional.',
  });
  teams.changeFieldControl('resourceLink', 'builtin', 'urlEditor', {});
};

module.exports.down = (migration) => {
  const teams = migration.editContentType('teams');
  teams.deleteField('resourceTitle');
  teams.deleteField('resourceDescription');
  teams.deleteField('resourceButtonCopy');
  teams.deleteField('resourceContactEmail');
  teams.deleteField('resourceLink');
};
