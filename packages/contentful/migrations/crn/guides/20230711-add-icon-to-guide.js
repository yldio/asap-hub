module.exports.description = 'Add icon to guide model';

module.exports.up = (migration) => {
  const icons = migration
    .createContentType('icon')
    .name('Icon')
    .description('')
    .displayField('title');

  icons
    .createField('title')
    .name('Title')
    .type('Symbol')
    .localized(false)
    .required(true)
    .validations([])
    .disabled(false)
    .omitted(false);

  icons
    .createField('asset')
    .name('Asset')
    .type('Link')
    .localized(false)
    .required(false)
    .validations([
      {
        linkMimetypeGroup: ['image'],
      },
    ])
    .disabled(false)
    .omitted(false)
    .linkType('Asset');

  icons.changeFieldControl('asset', 'builtin', 'assetLinkEditor', {
    showLinkEntityAction: true,
    showCreateEntityAction: false,
  });

  const guides = migration.editContentType('guides');

  guides
    .createField('icon')
    .name('Icon')
    .type('Link')
    .localized(false)
    .required(false)
    .disabled(false)
    .omitted(false)
    .validations([
      {
        linkContentType: ['icon'],
      },
    ])
    .linkType('Entry');
};

module.exports.down = (migration) => {
  const guides = migration.editContentType('guides');
  guides.deleteField('icon');

  const icons = migration.deleteContentType('icon');
};
