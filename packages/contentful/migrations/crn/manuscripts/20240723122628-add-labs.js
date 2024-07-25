module.exports.description = 'Add teams and labs to manuscript versions';

module.exports.up = (migration) => {
  const manuscriptVersions = migration.editContentType('manuscriptVersions');

  manuscriptVersions
    .createField('teams')
    .name('Teams')
    .type('Array')
    .localized(false)
    .required(false)
    .disabled(false)
    .omitted(false)
    .items({
      type: 'Link',

      validations: [
        {
          linkContentType: ['teams'],
        },
      ],

      linkType: 'Entry',
    });

  manuscriptVersions
    .createField('labs')
    .name('Labs')
    .type('Array')
    .localized(false)
    .required(false)
    .disabled(false)
    .omitted(false)
    .items({
      type: 'Link',

      validations: [
        {
          linkContentType: ['labs'],
        },
      ],

      linkType: 'Entry',
    });

  manuscriptVersions.changeFieldControl(
    'teams',
    'builtin',
    'entryLinksEditor',
    {
      bulkEditing: false,
      showLinkEntityAction: true,
      showCreateEntityAction: false,
    },
  );
  manuscriptVersions.changeFieldControl('labs', 'builtin', 'entryLinksEditor', {
    bulkEditing: false,
    showLinkEntityAction: true,
    showCreateEntityAction: false,
  });
};

module.exports.down = (migration) => {
  const manuscriptVersions = migration.editContentType('manuscriptVersions');
  manuscriptVersions.deleteField('teams');
  manuscriptVersions.deleteField('labs');
};
