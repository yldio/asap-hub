module.exports.description = 'Add readBy field';

module.exports.up = (migration) => {
  const discussions = migration.editContentType('discussions');
  discussions
    .createField('readBy')
    .name('Read By')
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
          linkContentType: ['users'],
        },
      ],

      linkType: 'Entry',
    });

  discussions.changeFieldControl('readBy', 'builtin', 'entryLinksEditor', {
    bulkEditing: false,
    showLinkEntityAction: true,
    showCreateEntityAction: false,
  });
};

module.exports.down = (migration) => {
  const discussions = migration.editContentType('discussions');
  discussions.deleteField('readBy');
};
