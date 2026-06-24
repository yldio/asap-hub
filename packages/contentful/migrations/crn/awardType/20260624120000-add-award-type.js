module.exports.description =
  'Create awardType content type and link it from awards';

module.exports.up = (migration) => {
  const awardType = migration
    .createContentType('awardType')
    .name('Award Type')
    .description('Reusable award definition: a name and its badge image.')
    .displayField('name');

  awardType
    .createField('name')
    .name('Name')
    .type('Symbol')
    .localized(false)
    .required(true)
    .validations([])
    .disabled(false)
    .omitted(false);

  awardType
    .createField('icon')
    .name('Icon')
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

  awardType.changeFieldControl('icon', 'builtin', 'assetLinkEditor', {
    showLinkEntityAction: true,
    showCreateEntityAction: true,
  });

  const awards = migration.editContentType('awards');

  awards
    .createField('awardType')
    .name('Award Type')
    .type('Link')
    .localized(false)
    .required(false)
    .validations([
      {
        linkContentType: ['awardType'],
      },
    ])
    .disabled(false)
    .omitted(false)
    .linkType('Entry');

  awards.changeFieldControl('awardType', 'builtin', 'entryLinkEditor', {
    showLinkEntityAction: true,
    showCreateEntityAction: true,
  });
};

module.exports.down = (migration) => {
  const awards = migration.editContentType('awards');
  awards.deleteField('awardType');

  migration.deleteContentType('awardType');
};
