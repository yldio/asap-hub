module.exports.description =
  'Remove related entity, add related entities and contributing cohorts';

module.exports.up = function (migration) {
  const outputs = migration.editContentType('outputs');

  outputs.deleteField('relatedEntity');

  outputs
    .createField('relatedEntities')
    .name('Related Entities')
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
          linkContentType: ['workingGroups', 'projects'],
        },
      ],

      linkType: 'Entry',
    });
  outputs
    .createField('contributionCohorts')
    .name('Contribution Cohorts')
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
          linkContentType: ['contributingCohorts'],
        },
      ],

      linkType: 'Entry',
    });

  outputs.changeFieldControl(
    'relatedEntities',
    'builtin',
    'entryLinksEditor',
    {},
  );

  outputs.changeFieldControl(
    'contributionCohorts',
    'builtin',
    'entryLinksEditor',
    {
      helpText:
        'The Cohorts field is not displayed on document types Code/software; Training Materials; GP2 Reports',
      bulkEditing: false,
      showLinkEntityAction: true,
      showCreateEntityAction: true,
    },
  );
};

module.exports.down = function (migration) {
  const outputs = migration.editContentType('outputs');

  outputs.deleteField('relatedEntities');
  outputs.deleteField('contributionCohorts');

  outputs
    .createField('relatedEntity')
    .name('Related Entity')
    .type('Link')
    .localized(false)
    .required(true)
    .validations([
      {
        linkContentType: ['projects', 'workingGroups'],
      },
    ])
    .disabled(false)
    .omitted(false)
    .linkType('Entry');

  outputs.changeFieldControl('relatedEntity', 'builtin', 'entryLinkEditor', {
    showLinkEntityAction: true,
    showCreateEntityAction: false,
  });
};
