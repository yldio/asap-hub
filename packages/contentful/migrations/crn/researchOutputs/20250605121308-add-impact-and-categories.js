module.exports.description = 'Add impact and categories fields to manuscripts';

module.exports.up = (migration) => {
  const researchOutputs = migration.editContentType('researchOutputs');

  researchOutputs
    .createField('impact')
    .name('Impact')
    .type('Link')
    .localized(false)
    .required(false)
    .validations([
      {
        linkContentType: ['impact'],
      },
    ])
    .disabled(false)
    .omitted(false)
    .linkType('Entry');

  researchOutputs
    .createField('categories')
    .name('Categories')
    .type('Array')
    .localized(false)
    .required(false)
    .validations([
      {
        size: {
          min: 0,
          max: 2,
        },

        message: 'Max 2 categories allowed',
      },
    ])
    .disabled(false)
    .omitted(false)
    .items({
      type: 'Link',

      validations: [
        {
          linkContentType: ['category'],
        },
      ],

      linkType: 'Entry',
    });

  researchOutputs.changeFieldControl('impact', 'builtin', 'entryLinkEditor', {
    showLinkEntityAction: true,
    showCreateEntityAction: false,
  });

  researchOutputs.changeFieldControl(
    'categories',
    'builtin',
    'entryLinksEditor',
    {
      bulkEditing: false,
      showLinkEntityAction: true,
      showCreateEntityAction: false,
    },
  );

  researchOutputs.moveField('impact').afterField('type');
  researchOutputs.moveField('categories').afterField('impact');
};

module.exports.down = (migration) => {
  const researchOutputs = migration.editContentType('researchOutputs');

  researchOutputs.deleteField('impact');
  researchOutputs.deleteField('categories');
};
