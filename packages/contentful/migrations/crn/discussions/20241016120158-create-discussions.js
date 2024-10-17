module.exports.description = 'Create discussions content model';

module.exports.up = (migration) => {
  const discussions = migration
    .createContentType('discussions')
    .name('Discussions')
    .description('');

  discussions
    .createField('message')
    .name('Message')
    .type('Link')
    .localized(false)
    .required(true)
    .disabled(false)
    .omitted(false)
    .validations([
      {
        linkContentType: ['messages'],
      },
    ])
    .linkType('Entry');

  discussions
    .createField('replies')
    .name('Replies')
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
          linkContentType: ['messages'],
        },
      ],

      linkType: 'Entry',
    });
};

module.exports.down = (migration) => {
  migration.deleteContentType('discussions');
};
