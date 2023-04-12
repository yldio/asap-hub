module.exports.description = 'Create teams and external tools content models';

module.exports.up = (migration) => {
  const teams = migration
    .createContentType('teams')
    .name('Teams')
    .description('')
    .displayField('displayName');
  teams
    .createField('displayName')
    .name('Display Name')
    .type('Symbol')
    .localized(false)
    .required(true)
    .validations([])
    .disabled(false)
    .omitted(false);
  teams
    .createField('inactiveSince')
    .name('The team is inactive since')
    .type('Date')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);

  teams
    .createField('applicationNumber')
    .name('Application Number')
    .type('Symbol')
    .localized(false)
    .required(true)
    .validations([
      {
        unique: true,
      },
    ])
    .disabled(false)
    .omitted(false);

  teams
    .createField('expertiseAndResourceTags')
    .name('Expertise and Resources')
    .type('Array')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false)
    .items({
      type: 'Symbol',
      validations: [],
    });

  teams
    .createField('projectTitle')
    .name('Project Title')
    .type('Text')
    .localized(false)
    .required(true)
    .validations([])
    .disabled(false)
    .omitted(false);
  teams
    .createField('projectSummary')
    .name('Project Summary')
    .type('Text')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);

  teams
    .createField('tools')
    .name('External Tools')
    .type('Array')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false)
    .items({
      type: 'Link',

      validations: [
        {
          linkContentType: ['externalTools'],
        },
      ],

      linkType: 'Entry',
    });

  teams.changeFieldControl('displayName', 'builtin', 'singleLine', {});
  teams.changeFieldControl('inactiveSince', 'builtin', 'datePicker', {});
  teams.changeFieldControl('applicationNumber', 'builtin', 'singleLine', {});
  teams.changeFieldControl(
    'expertiseAndResourceTags',
    'builtin',
    'tagEditor',
    {},
  );
  teams.changeFieldControl('projectTitle', 'builtin', 'multipleLine', {});
  teams.changeFieldControl('projectSummary', 'builtin', 'multipleLine', {});
  teams.changeFieldControl('tools', 'builtin', 'entryLinksEditor', {});

  const externalTools = migration
    .createContentType('externalTools')
    .name('External Tools')
    .description("Team's external tools")
    .displayField('name');
  externalTools
    .createField('name')
    .name('Name')
    .type('Symbol')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);
  externalTools
    .createField('description')
    .name('Description')
    .type('Symbol')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);
  externalTools
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
  externalTools.changeFieldControl('name', 'builtin', 'singleLine', {});
  externalTools.changeFieldControl('description', 'builtin', 'singleLine', {});
  externalTools.changeFieldControl('url', 'builtin', 'urlEditor', {});
};

module.exports.down = (migration) => {
  migration.deleteContentType('teams');
  migration.deleteContentType('externalTools');
};
