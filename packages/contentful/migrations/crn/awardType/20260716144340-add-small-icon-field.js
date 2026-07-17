module.exports.description = 'Add small icon field';

module.exports.up = (migration) => {
  const awardType = migration.editContentType('awardType');

  awardType
    .createField('smallIcon')
    .name('Small Icon')
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

  awardType.changeFieldControl('smallIcon', 'builtin', 'assetLinkEditor', {
    showLinkEntityAction: true,
    showCreateEntityAction: true,
  });
};

module.exports.down = (migration) => {
  const awardType = migration.editContentType('awardType');
  awardType.deleteField('smallIcon');
};
