module.exports.description = 'Adds discussions field to manuscripts';

module.exports.up = (migration) => {
  const manuscripts = migration.editContentType('manuscripts');
  manuscripts
    .createField('discussions')
    .name('Discussions')
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
          linkContentType: ['discussions'],
        },
      ],

      linkType: 'Entry',
    });

  manuscripts.changeFieldControl('discussions', 'builtin', 'entryLinksEditor', {
    bulkEditing: false,
    showLinkEntityAction: true,
    showCreateEntityAction: false,
  });
};

module.exports.down = (migration) => {
  const manuscripts = migration.editContentType('manuscripts');
  manuscripts.deleteField('discussions');
};
