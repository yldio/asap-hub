module.exports.description = 'Add preliminary data sharing model';

module.exports.up = (migration) => {
  const preliminaryDataSharing = migration
    .createContentType('preliminaryDataSharing')
    .name('Preliminary Data Sharing')
    .description('');

  preliminaryDataSharing
    .createField('team')
    .name('Team')
    .type('Link')
    .localized(false)
    .required(true)
    .validations([
      {
        linkContentType: ['teams'],
      },
    ])
    .disabled(false)
    .omitted(false)
    .linkType('Entry');

  preliminaryDataSharing
    .createField('preliminaryDataShared')
    .name('Preliminary Data Shared')
    .type('Boolean')
    .localized(false)
    .required(true)
    .validations([])
    .disabled(false)
    .omitted(false);

  preliminaryDataSharing.changeFieldControl(
    'team',
    'builtin',
    'entryLinkEditor',
    {
      showLinkEntityAction: true,
      showCreateEntityAction: false,
    },
  );

  preliminaryDataSharing.changeFieldControl(
    'preliminaryDataShared',
    'builtin',
    'boolean',
    {},
  );
};

module.exports.down = (migration) => {
  migration.deleteContentType('preliminaryDataSharing');
};
