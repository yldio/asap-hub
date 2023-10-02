module.exports.description =
  'Remove related entity, add related entities and contributing cohorts';

module.exports.up = function (migration) {
  const outputs = migration.editContentType('outputs');

  outputs
    .createField('mainEntity')
    .name('Main Entity')
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
    .createField('contributingCohorts')
    .name('Contributing Cohorts')
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

  outputs.changeFieldControl('mainEntity', 'builtin', 'entryLinkEditor', {
    showLinkEntityAction: true,
    showCreateEntityAction: false,
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

  migration.deriveLinkedEntries({
    // Start from blog post's category field
    contentType: 'outputs',
    from: ['relatedEntity'],
    // This is the field we created above, which will hold the link to the derived category entries.
    toReferenceField: 'relatedEntities',
    // The new entries to create are of type 'category'.
    derivedContentType: ['projects', 'workingGroup'],
    derivedFields: ['title'],
    identityKey: async (from) => {
      // The category name will be used as an identity key.
      return from.title['en-US'].toLowerCase();
    },
    deriveEntryForLocale: async (from, locale, { id }) => {
      // The structure represents the resulting category entry with the 2 fields mentioned in the `derivedFields` property.
      return from.relatedEntity[locale];
    },
  });
  migration.deriveLinkedEntries({
    // Start from blog post's category field
    contentType: 'outputs',
    from: ['relatedEntity'],
    // This is the field we created above, which will hold the link to the derived category entries.
    toReferenceField: 'mainEntity',
    derivedFields: ['title'],
    // The new entries to create are of type 'category'.
    derivedContentType: ['projects', 'workingGroup'],
    identityKey: async (from) => {
      // The category name will be used as an identity key.
      return from.title['en-US'].toLowerCase();
    },
    deriveEntryForLocale: async (from, locale) => {
      // The structure represents the resulting category entry with the 2 fields mentioned in the `derivedFields` property.
      return from.relatedEntity[locale];
    },
  });
};

module.exports.down = function (migration) {
  const outputs = migration.editContentType('outputs');

  outputs.deleteField('relatedEntities');
  outputs.deleteField('contributionCohorts');
  outputs.deleteField('mainEntity');
};
