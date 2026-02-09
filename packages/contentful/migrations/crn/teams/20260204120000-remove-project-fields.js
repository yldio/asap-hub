module.exports.description = 'Remove project-related fields from teams';

module.exports.up = (migration) => {
  const teams = migration.editContentType('teams');

  teams.deleteField('teamId');
  teams.deleteField('grantId');
  teams.deleteField('applicationNumber');
  teams.deleteField('projectTitle');
  teams.deleteField('projectSummary');
  teams.deleteField('proposal');
  teams.deleteField('supplementGrant');
  teams.deleteField('researchTags');
};

module.exports.down = (migration) => {
  const teams = migration.editContentType('teams');

  teams
    .createField('teamId')
    .name('Team ID')
    .type('Symbol')
    .localized(false)
    .required(true)
    .validations([])
    .disabled(false)
    .omitted(false);
  teams.changeFieldControl('teamId', 'builtin', 'singleLine', {});

  teams
    .createField('grantId')
    .name('Grant ID')
    .type('Symbol')
    .localized(false)
    .required(true)
    .validations([])
    .disabled(false)
    .omitted(false);
  teams.changeFieldControl('grantId', 'builtin', 'singleLine', {});

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
  teams.changeFieldControl('applicationNumber', 'builtin', 'singleLine', {});

  teams
    .createField('projectTitle')
    .name('Project Title')
    .type('Text')
    .localized(false)
    .required(true)
    .validations([])
    .disabled(false)
    .omitted(false);
  teams.changeFieldControl('projectTitle', 'builtin', 'multipleLine', {});

  teams
    .createField('projectSummary')
    .name('Project Summary')
    .type('Text')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);
  teams.changeFieldControl('projectSummary', 'builtin', 'multipleLine', {});

  teams
    .createField('proposal')
    .name('Proposal')
    .type('Link')
    .localized(false)
    .required(false)
    .validations([
      {
        linkContentType: ['researchOutputs'],
      },
    ])
    .disabled(false)
    .omitted(false)
    .linkType('Entry');
  teams.changeFieldControl('proposal', 'builtin', 'entryLinkEditor', {
    showLinkEntityAction: true,
    showCreateEntityAction: false,
  });

  teams
    .createField('supplementGrant')
    .name('Supplement Grant')
    .type('Link')
    .localized(false)
    .required(false)
    .validations([
      {
        linkContentType: ['supplementGrant'],
        message: 'Only entries from Supplement Grant model can be selected.',
      },
    ])
    .disabled(false)
    .omitted(false)
    .linkType('Entry');
  teams.changeFieldControl('supplementGrant', 'builtin', 'entryCardEditor', {});

  teams
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
};
