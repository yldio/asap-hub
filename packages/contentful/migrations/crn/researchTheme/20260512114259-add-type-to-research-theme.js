module.exports.description = 'Add types to research theme';

module.exports.up = (migration) => {
  const researchTheme = migration.editContentType('researchTheme');

  researchTheme
    .createField('types')
    .name('Types')
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
    to: ['types'],
    transformEntryForLocale: async (from) => {
      if (!from?.name || !from?.name?.['en-US']) return;
      return {
        types:
          from.name['en-US'] !== 'Tool Generation'
            ? ['Discovery']
            : ['Resource'],
      };
    },
  });

  researchTheme.editField('types').required(true);

  researchTheme.changeFieldControl('types', 'builtin', 'checkbox', {});
};

module.exports.down = (migration) => {
  const researchTheme = migration.editContentType('researchTheme');
  researchTheme.deleteField('types');
};
