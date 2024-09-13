module.exports.description = 'Create supplement grant model';

module.exports.up = (migration) => {
  const supplementGrant = migration
    .createContentType('supplementGrant')
    .name('Supplement Grant')
    .description('')
    .displayField('title');

  supplementGrant
    .createField('title')
    .name('Grant Title')
    .type('Text')
    .localized(false)
    .required(true)
    .validations([])
    .disabled(false)
    .omitted(false);

  supplementGrant
    .createField('description')
    .name('Grant Description')
    .type('Text')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);

  supplementGrant
    .createField('startDate')
    .name('Grant Start Date')
    .type('Date')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);

  supplementGrant
    .createField('endDate')
    .name('Grant End Date')
    .type('Date')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);

  supplementGrant
    .createField('proposal')
    .name('Grant Proposal')
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

  supplementGrant.changeFieldControl('title', 'builtin', 'multipleLine', {});
  supplementGrant.changeFieldControl(
    'description',
    'builtin',
    'multipleLine',
    {},
  );

  supplementGrant.changeFieldControl('startDate', 'builtin', 'datePicker', {});
  supplementGrant.changeFieldControl('endDate', 'builtin', 'datePicker', {});

  supplementGrant.changeFieldControl('proposal', 'builtin', 'entryLinkEditor', {
    showLinkEntityAction: true,
    showCreateEntityAction: false,
  });
};

module.exports.down = (migration) => {
  migration.deleteContentType('supplementGrant');
};
