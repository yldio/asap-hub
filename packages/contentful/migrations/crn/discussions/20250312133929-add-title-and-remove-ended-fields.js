module.exports.description =
  'Add title field and remove ended at and ended by fields';

module.exports.up = (migration) => {
  const discussions = migration.editContentType('discussions');
  discussions.deleteField('endedAt');
  discussions.deleteField('endedBy');

  discussions
    .createField('title')
    .name('Title')
    .type('Symbol')
    .localized(false)
    .required(true)
    .validations([
      {
        size: {
          min: 1,
          max: 100,
        },
      },
    ])
    .disabled(false)
    .omitted(false);
  discussions.changeFieldControl('title', 'builtin', 'singleLine', {});
  discussions.displayField('title');
  discussions.moveField('title').toTheTop();
};

module.exports.down = (migration) => {
  const discussions = migration.editContentType('discussions');

  discussions
    .createField('endedAt')
    .name('Ended At')
    .type('Date')
    .localized(false)
    .required(false)
    .disabled(false)
    .omitted(false)
    .validations([]);

  discussions
    .createField('endedBy')
    .name('Ended By')
    .type('Link')
    .localized(false)
    .required(false)
    .disabled(false)
    .omitted(false)
    .validations([
      {
        linkContentType: ['users'],
      },
    ])
    .linkType('Entry');

  discussions.deleteField('title');
};
