module.exports.description = 'Create aims content model';

module.exports.up = (migration) => {
  const aims = migration
    .createContentType('aims')
    .name('Aims')
    .description('')
    .displayField('description');

  aims
    .createField('description')
    .name('Description')
    .type('Text')
    .localized(false)
    .required(true)
    .validations([
      {
        size: { max: 750 },
        message: 'Description cannot exceed 750 characters.',
      },
    ])
    .disabled(false)
    .omitted(false);

  aims
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

  aims.changeFieldControl('description', 'builtin', 'multipleLine', {});
  aims.changeFieldControl('milestones', 'builtin', 'entryLinksEditor', {
    showLinkEntityAction: true,
    showCreateEntityAction: false,
  });
};

module.exports.down = (migration) => {
  migration.deleteContentType('aims');
};
