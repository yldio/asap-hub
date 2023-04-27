module.exports.description = 'Create working group content models';

module.exports.up = (migration) => {
  const workingGroups = migration
    .createContentType('workingGroups')
    .name('Working Groups')
    .description('')
    .displayField('title');

  workingGroups
    .createField('title')
    .name('Title')
    .type('Symbol')
    .localized(false)
    .required(true)
    .validations([])
    .disabled(false)
    .omitted(false);

  workingGroups
    .createField('shortDescription')
    .name('Short Description')
    .type('Symbol')
    .localized(false)
    .required(true)
    .validations([])
    .disabled(false)
    .omitted(false);

  workingGroups
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

  workingGroups
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

  workingGroups
    .createField('leadingMembers')
    .name('Leading Members')
    .type('Symbol')
    .localized(false)
    .required(true)
    .validations([])
    .disabled(false)
    .omitted(false);

  workingGroups
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

  workingGroups
    .createField('primaryEmail')
    .name('Working Group Email')
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

  workingGroups
    .createField('secondaryEmail')
    .name("WG's Lead Email")
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

  workingGroups
    .createField('startDate')
    .name('Start Date')
    .type('Date')
    .localized(false)
    .required(true)
    .validations([])
    .disabled(false)
    .omitted(false);

  workingGroups
    .createField('endDate')
    .name('End Date')
    .type('Date')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);

  workingGroups
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

  workingGroups
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

  workingGroups
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

  workingGroups
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

  workingGroups
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

  workingGroups
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

  workingGroups
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

  workingGroups.changeFieldControl('title', 'builtin', 'singleLine', {});
  workingGroups.changeFieldControl(
    'shortDescription',
    'builtin',
    'singleLine',
    {},
  );
  workingGroups.changeFieldControl(
    'description',
    'builtin',
    'multipleLine',
    {},
  );
  workingGroups.changeFieldControl('calendars', 'builtin', 'entryLinkEditor', {
    showLinkEntityAction: true,
    showCreateEntityAction: false,
  });
  workingGroups.changeFieldControl(
    'leadingMembers',
    'builtin',
    'singleLine',
    {},
  );
  workingGroups.changeFieldControl('primaryEmail', 'builtin', 'singleLine', {});
  workingGroups.changeFieldControl(
    'secondaryEmail',
    'builtin',
    'singleLine',
    {},
  );

  // #####
  workingGroups.changeFieldControl('startDate', 'builtin', 'datePicker', {
    ampm: '24',
    format: 'dateonly',
  });
  workingGroups.changeFieldControl('endDate', 'builtin', 'datePicker', {
    ampm: '24',
    format: 'dateonly',
  });
  workingGroups.changeFieldControl('calendars', 'builtin', 'entryLinkEditor', {
    showLinkEntityAction: true,
    showCreateEntityAction: false,
  });
  workingGroups.changeFieldControl('projectProposal', 'builtin', 'urlEditor', {
    helpText: 'URL must start with http:// or https://',
  });
  workingGroups.changeFieldControl('pmEmail', 'builtin', 'singleLine', {});
  workingGroups.changeFieldControl('leadEmail', 'builtin', 'singleLine', {});
  workingGroups.changeFieldControl('keywords', 'builtin', 'tagEditor', {});
  workingGroups.changeFieldControl('traineeProject', 'builtin', 'boolean', {
    helpText: 'check if project is a trainee project',
  });
  workingGroups.changeFieldControl(
    'opportunitiesLink',
    'builtin',
    'urlEditor',
    {
      helpText: 'URL must start with http:// or https://',
    },
  );
};

module.exports.down = (migration) => {
  migration.deleteContentType('workingGroups');
};
