module.exports.description = 'Add type to research theme';

module.exports.up = (migration) => {
  const researchTheme = migration.editContentType('researchTheme');

  researchTheme
    .createField('type')
    .name('Type')
    .type('Array')
    .localized(false)
    .required(false)
    .validations([])
    .defaultValue({
      'en-US': ['Discovery'],
    })
    .disabled(false)
    .omitted(false)
    .items({
      type: 'Symbol',
      validations: [
        {
          in: ['Discovery', 'Resource'],
        },
      ],
    });

  migration.transformEntries({
    contentType: 'researchTheme',
    from: ['name'],
    to: ['type'],
    shouldPublish: false,
    transformEntryForLocale: async (from) => {
      if (!from?.name || !from?.name?.['en-US']) return;
      return {
        type:
          from.name['en-US'] !== 'Tool Generation'
            ? ['Discovery']
            : ['Resource'],
      };
    },
  });

  researchTheme.editField('type').required(true);

  researchTheme.changeFieldControl('type', 'builtin', 'checkbox', {});
};

module.exports.down = (migration) => {
  const researchTheme = migration.editContentType('researchTheme');
  researchTheme.deleteField('type');
};
