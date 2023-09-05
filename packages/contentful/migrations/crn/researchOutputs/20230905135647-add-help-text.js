module.exports.description = 'Add help texts copied from Squidex';

module.exports.up = (migration) => {
  const researchOutputs = migration.editContentType('researchOutputs');

  researchOutputs.changeFieldControl(
    'lastUpdatedPartial',
    'app',
    'v97H7wgmtstfxNheYWy0G',
    {
      exclude: 'adminNotes, publishDate',
      helpText: 'Does not include changes to Publish Date and Admin notes',
    },
  );

  researchOutputs.changeFieldControl('asapFunded', 'builtin', 'dropdown', {
    helpText: '"Not sure" will not be shown on the Hub',
  });

  researchOutputs.changeFieldControl(
    'usedInAPublication',
    'builtin',
    'dropdown',
    {
      helpText: '"Not sure" will not be shown on the Hub',
    },
  );

  researchOutputs.changeFieldControl('publishDate', 'builtin', 'datePicker', {
    ampm: '24',
    format: 'timeZ',
    helpText:
      'Date of publishing (outside the Hub). Only applies to outputs that have been published.',
  });

  researchOutputs.changeFieldControl(
    'labCatalogNumber',
    'builtin',
    'singleLine',
    {
      helpText:
        'If this is a hyperlink, please start with "http://" or "https://"',
    },
  );
};

module.exports.down = (migration) => {
  const researchOutputs = migration.editContentType('researchOutputs');

  researchOutputs.changeFieldControl(
    'lastUpdatedPartial',
    'app',
    'v97H7wgmtstfxNheYWy0G',
    {
      exclude: 'adminNotes, publishDate',
    },
  );

  researchOutputs.changeFieldControl('asapFunded', 'builtin', 'dropdown', {});

  researchOutputs.changeFieldControl(
    'usedInAPublication',
    'builtin',
    'dropdown',
    {},
  );

  researchOutputs.changeFieldControl('publishDate', 'builtin', 'datePicker', {
    ampm: '24',
    format: 'timeZ',
  });

  researchOutputs.changeFieldControl(
    'labCatalogNumber',
    'builtin',
    'singleLine',
    {},
  );
};
