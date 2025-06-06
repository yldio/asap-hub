module.exports.description = 'Add impact and categories fields to manuscripts';

module.exports.up = (migration) => {
  const manuscripts = migration.editContentType('manuscripts');

  manuscripts
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

  manuscripts
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

  manuscripts.changeFieldControl('impact', 'builtin', 'entryLinkEditor', {
    showLinkEntityAction: true,
    showCreateEntityAction: false,
  });

  manuscripts.changeFieldControl('categories', 'builtin', 'entryLinksEditor', {
    bulkEditing: false,
    showLinkEntityAction: true,
    showCreateEntityAction: false,
  });

  manuscripts.moveField('impact').afterField('url');
  manuscripts.moveField('categories').afterField('impact');
};

module.exports.down = (migration) => {
  const manuscripts = migration.editContentType('manuscripts');

  manuscripts.deleteField('impact');
  manuscripts.deleteField('categories');
};
