module.exports.description = 'Create projects content models';

module.exports.up = (migration) => {
  const projects = migration
    .createContentType('projects')
    .name('Projects')
    .description('')
    .displayField('title');

  projects
    .createField('title')
    .name('Title')
    .type('Symbol')
    .localized(false)
    .required(true)
    .validations([])
    .disabled(false)
    .omitted(false);

  projects
    .createField('members')
    .name('Members')
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
          linkContentType: ['projectMembership'],
        },
      ],

      linkType: 'Entry',
    });

  projects
    .createField('startDate')
    .name('Start Date')
    .type('Date')
    .localized(false)
    .required(true)
    .validations([])
    .disabled(false)
    .omitted(false);

  projects
    .createField('endDate')
    .name('End Date')
    .type('Date')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);

  projects
    .createField('calendars')
    .name('Calendars')
    .type('Link')
    .localized(false)
    .required(false)
    .validations([
      {
        linkContentType: ['calendars'],
      },
    ])
    .disabled(false)
    .omitted(false)
    .linkType('Entry');

  projects
    .createField('status')
    .name('Status')
    .type('Symbol')
    .localized(false)
    .required(true)
    .defaultValue({
      'en-US': 'Active',
    })
    .validations([
      {
        in: ['Active', 'Completed', 'Paused'],
      },
    ])
    .disabled(false)
    .omitted(false);

  projects
    .createField('projectProposal')
    .name('Project Proposal')
    .type('Symbol')
    .localized(false)
    .required(false)
    .validations([
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
    ])
    .disabled(false)
    .omitted(false);

  projects
    .createField('description')
    .name('Description')
    .type('Text')
    .localized(false)
    .required(true)
    .validations([
      {
        size: {
          max: 2500,
        },
      },
    ])
    .disabled(false)
    .omitted(false);

  projects
    .createField('pmEmail')
    .name('PM Email')
    .type('Symbol')
    .localized(false)
    .required(false)
    .validations([
      {
        unique: true,
      },
      {
        regexp: {
          pattern: '^\\w[\\w.\\-+]*@([\\w-]+\\.)+[\\w-]+$',
          flags: null,
        },
      },
    ])
    .disabled(false)
    .omitted(false);

  projects
    .createField('leadEmail')
    .name('Lead Email')
    .type('Symbol')
    .localized(false)
    .required(false)
    .validations([
      {
        unique: true,
      },
      {
        regexp: {
          pattern: '^\\w[\\w.\\-+]*@([\\w-]+\\.)+[\\w-]+$',
          flags: null,
        },
      },
    ])
    .disabled(false)
    .omitted(false);

  projects
    .createField('keywords')
    .name('Keywords')
    .type('Array')
    .localized(false)
    .required(true)
    .validations([])
    .disabled(false)
    .omitted(false)
    .items({
      type: 'Symbol',
      validations: [
        {
          size: {
            max: 6,
          },
        },
      ],
    });

  projects
    .createField('milestones')
    .name('Milestones')
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
          linkContentType: ['milestones'],
        },
      ],

      linkType: 'Entry',
    });

  projects
    .createField('resources')
    .name('Resources')
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
          linkContentType: ['resources'],
        },
      ],

      linkType: 'Entry',
    });

  projects
    .createField('traineeProject')
    .name('Trainee Project')
    .type('Boolean')
    .localized(false)
    .required(true)
    .validations([])
    .disabled(false)
    .omitted(false);

  projects
    .createField('opportunitiesLink')
    .name('Opportunities Link')
    .type('Symbol')
    .localized(false)
    .required(false)
    .validations([
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
    ])
    .disabled(false)
    .omitted(false);

  projects.changeFieldControl('title', 'builtin', 'singleLine', {});
  projects.changeFieldControl('startDate', 'builtin', 'datePicker', {
    ampm: '24',
    format: 'dateonly',
  });
  projects.changeFieldControl('endDate', 'builtin', 'datePicker', {
    ampm: '24',
    format: 'dateonly',
  });
  projects.changeFieldControl('calendars', 'builtin', 'entryLinkEditor', {
    showLinkEntityAction: true,
    showCreateEntityAction: false,
  });
  projects.changeFieldControl('projectProposal', 'builtin', 'urlEditor', {
    helpText: 'URL must start with http:// or https://',
  });
  projects.changeFieldControl('description', 'builtin', 'multipleLine', {});

  projects.changeFieldControl('pmEmail', 'builtin', 'singleLine', {});
  projects.changeFieldControl('leadEmail', 'builtin', 'singleLine', {});
  projects.changeFieldControl('keywords', 'builtin', 'tagEditor', {});
  projects.changeFieldControl('traineeProject', 'builtin', 'boolean', {
    helpText: 'check if project is a trainee project',
  });
  projects.changeFieldControl('opportunitiesLink', 'builtin', 'urlEditor', {
    helpText: 'URL must start with http:// or https://',
  });
};

module.exports.down = (migration) => {
  migration.deleteContentType('projects');
};
