module.exports.description = 'Create projects content model';

module.exports.up = (migration) => {
  const projects = migration
    .createContentType('projects')
    .name('Projects')
    .description('')
    .displayField('title');

  projects
    .createField('title')
    .name('Title')
    .type('Text')
    .localized(false)
    .required(true)
    .validations([
      { size: { max: 256 }, message: 'Title cannot exceed 256 characters.' },
    ])
    .disabled(false)
    .omitted(false);

  projects
    .createField('projectId')
    .name('Project ID')
    .type('Symbol')
    .localized(false)
    .required(true)
    .validations([])
    .disabled(false)
    .omitted(false);

  projects
    .createField('grantId')
    .name('Grant ID')
    .type('Symbol')
    .localized(false)
    .required(true)
    .validations([])
    .disabled(false)
    .omitted(false);

  projects
    .createField('originalGrant')
    .name('Original Grant')
    .type('Text')
    .localized(false)
    .required(true)
    .validations([])
    .disabled(false)
    .omitted(false);

  projects
    .createField('supplementGrant')
    .name('Supplement Grant')
    .type('Link')
    .localized(false)
    .required(false)
    .validations([
      {
        linkContentType: ['supplementGrant'],
      },
    ])
    .disabled(false)
    .omitted(false)
    .linkType('Entry');

  projects
    .createField('projectType')
    .name('Project Type')
    .type('Symbol')
    .localized(false)
    .required(true)
    .validations([
      {
        in: ['Discovery Project', 'Resource Project', 'Trainee Project'],
      },
    ])
    .disabled(false)
    .omitted(false);

  projects
    .createField('resourceType')
    .name('Resource Type')
    .type('Link')
    .localized(false)
    .required(false)
    .validations([
      {
        linkContentType: ['resourceType'],
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
        in: ['Active', 'Closed', 'Completed'],
      },
    ])
    .disabled(false)
    .omitted(false);

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
    .required(true)
    .validations([])
    .disabled(false)
    .omitted(false);

  projects
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

  projects
    .createField('supplementGrant')
    .name('Supplement Grant')
    .type('Link')
    .localized(false)
    .required(false)
    .validations([
      {
        linkContentType: ['supplementGrant'],
      },
    ])
    .disabled(false)
    .omitted(false)
    .linkType('Entry');

  projects
    .createField('researchTags')
    .name('Tags')
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
          linkContentType: ['researchTags'],
        },
      ],

      linkType: 'Entry',
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
    .createField('members')
    .name('Members')
    .type('Array')
    .localized(false)
    .required(true)
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
    .createField('contactEmail')
    .name('Contact Email')
    .type('Symbol')
    .localized(false)
    .required(true)
    .validations([
      {
        regexp: {
          pattern: '^\\w[\\w.\\-+]*@([\\w-]+\\.)+[\\w-]+$',
          flags: null,
        },
      },
    ])
    .disabled(false)
    .omitted(false);

  projects.changeFieldControl('title', 'builtin', 'multipleLine', {});
  projects.changeFieldControl('originalGrant', 'builtin', 'multipleLine', {});
  projects.changeFieldControl('startDate', 'builtin', 'datePicker', {
    ampm: '24',
    format: 'dateonly',
  });
  projects.changeFieldControl('endDate', 'builtin', 'datePicker', {
    ampm: '24',
    format: 'dateonly',
  });
  projects.changeFieldControl('applicationNumber', 'builtin', 'singleLine', {});
  projects.changeFieldControl(
    'supplementGrant',
    'builtin',
    'entryCardEditor',
    {},
  );
  projects.changeFieldControl('contactEmail', 'builtin', 'singleLine', {});
  projects.changeFieldControl('resourceType', 'builtin', 'entryLinkEditor', {
    showLinkEntityAction: true,
    showCreateEntityAction: false,
  });

  // currently pointing to demo app but will be changed to actual app before merging
  projects.changeFieldControl('members', 'app', '5ZNAQpIJ4hf2Yk7QTjCI2i', {
    entityName: 'projectMember',
    showUserEmail: false,
    showLinkEntityAction: false,
    showCreateEntityAction: true,
  });
};

module.exports.down = (migration) => {
  migration.deleteContentType('projects');
};
