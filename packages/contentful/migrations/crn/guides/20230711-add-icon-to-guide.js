module.exports.description = 'Add icon to guide model';

module.exports.up = (migration) => {
  const guides = migration.editContentType('guides');

  guides
    .createField('icon')
    .name('Icon')
    .type('Link')
    .localized(false)
    .required(true)
    .validations([
      {
        linkMimetypeGroup: ['image'],
      },
    ])
    .disabled(false)
    .omitted(false)
    .linkType('Asset');

  guide.changeFieldControl('icon', 'builtin', 'assetLinkEditor', {
    showLinkEntityAction: true,
    showCreateEntityAction: false,
  });
};

module.exports.down = (migration) => {
  const guides = migration.editContentType('guides');
  guides.deleteField('icon');
};
