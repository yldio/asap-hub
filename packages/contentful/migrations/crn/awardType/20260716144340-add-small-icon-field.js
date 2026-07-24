module.exports.description = 'Add small icon field';

module.exports.up = (migration) => {
  const awardType = migration.editContentType('awardType');

  awardType
    .createField('smallIcon')
    .name('Small Icon')
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

  awardType.changeFieldControl('smallIcon', 'builtin', 'assetLinkEditor', {
    showLinkEntityAction: true,
    showCreateEntityAction: true,
  });

  awardType.editField('icon').required(true);
};

module.exports.down = (migration) => {
  const awardType = migration.editContentType('awardType');
  awardType.deleteField('smallIcon');
  awardType.editField('icon').required(false);
};
