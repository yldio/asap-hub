module.exports.description = 'Create outputs content models';

module.exports.up = (migration) => {
  const outputs = migration
    .createContentType('outputs')
    .name('Outputs')
    .description('')
    .displayField('title');

  outputs
    .createField('title')
    .name('Title')
    .type('Symbol')
    .localized(false)
    .required(true)
    .validations([])
    .disabled(false)
    .omitted(false);

  outputs
    .createField('documentType')
    .name('Document type')
    .type('Symbol')
    .localized(false)
    .required(true)
    .validations([
      {
        in: [
          'Procedural_Form',
          'Update',
          'Training_Material',
          'Data_Release',
          'Article',
          'Code_Software',
        ],
      },
    ])
    .disabled(false)
    .omitted(false);

  outputs
    .createField('type')
    .name('SubType')
    .type('Symbol')
    .localized(false)
    .required(false)
    .validations([
      {
        in: ['Preprints', 'Published'],
      },
    ])
    .disabled(false)
    .omitted(false);

  outputs
    .createField('type')
    .name('Type')
    .type('Symbol')
    .localized(false)
    .required(false)
    .validations([
      {
        in: ['Research', 'Review', 'Letter', 'Hot_Topic', 'Blog'],
      },
    ])
    .disabled(false)
    .omitted(false);

  outputs
    .createField('addedDate')
    .name('Added Date')
    .type('Date')
    .localized(false)
    .required(true)
    .validations([])
    .disabled(false)
    .omitted(false);

  outputs
    .createField('lastUpdatedPartial')
    .name('Last Updated (partial)')
    .type('Date')
    .localized(false)
    .required(true)
    .validations([])
    .disabled(true)
    .omitted(false);
  // ##########################
  outputs
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

  outputs
    .createField('startDate')
    .name('Start Date')
    .type('Date')
    .localized(false)
    .required(true)
    .validations([])
    .disabled(false)
    .omitted(false);

  outputs
    .createField('endDate')
    .name('End Date')
    .type('Date')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);

  outputs
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

  outputs
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

  outputs
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

  outputs
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

  outputs
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

  outputs
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

  outputs
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

  outputs
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

  outputs
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

  outputs
    .createField('traineeProject')
    .name('Trainee Project')
    .type('Boolean')
    .localized(false)
    .required(true)
    .validations([])
    .disabled(false)
    .omitted(false);

  outputs
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

  // ##########################
  outputs.changeFieldControl('title', 'builtin', 'singleLine', {});
  outputs.changeFieldControl('addedData', 'builtin', 'datePicker', {
    ampm: '12',
    format: 'timeZ',
    helpText:
      'Date output was shared with GP2 Network (different from publication date)',
  });
  outputs.changeFieldControl('lastUpdatedPartial', 'builtin', 'datePicker', {
    ampm: '12',
    format: 'timeZ',
    helpText: 'Does not include changes to Publish Date and Admin notes',
  });

  // ##########################

  outputs.changeFieldControl('startDate', 'builtin', 'datePicker', {
    ampm: '24',
    format: 'dateonly',
  });
  outputs.changeFieldControl('endDate', 'builtin', 'datePicker', {
    ampm: '24',
    format: 'dateonly',
  });
  outputs.changeFieldControl('calendars', 'builtin', 'entryLinkEditor', {
    showLinkEntityAction: true,
    showCreateEntityAction: false,
  });
  outputs.changeFieldControl('projectProposal', 'builtin', 'urlEditor', {
    helpText: 'URL must start with http:// or https://',
  });
  outputs.changeFieldControl('description', 'builtin', 'multipleLine', {});

  outputs.changeFieldControl('pmEmail', 'builtin', 'singleLine', {});
  outputs.changeFieldControl('leadEmail', 'builtin', 'singleLine', {});
  outputs.changeFieldControl('keywords', 'builtin', 'tagEditor', {});
  outputs.changeFieldControl('traineeProject', 'builtin', 'boolean', {
    helpText: 'check if project is a trainee project',
  });
  outputs.changeFieldControl('opportunitiesLink', 'builtin', 'urlEditor', {
    helpText: 'URL must start with http:// or https://',
  });
};

module.exports.down = (migration) => {
  migration.deleteContentType('projects');
};
