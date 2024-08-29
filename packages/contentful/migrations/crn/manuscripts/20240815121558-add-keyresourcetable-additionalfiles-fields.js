module.exports.description =
  'Add Key Resource Table & Additional Files fields to Manuscript Version';

module.exports.up = (migration) => {
  const manuscriptVersions = migration.editContentType('manuscriptVersions');

  manuscriptVersions
    .createField('keyResourceTable')
    .name('Key Resource Table')
    .type('Link')
    .localized(false)
    .required(false)
    .validations([
      {
        linkMimetypeGroup: ['spreadsheet'],
      },
    ])
    .disabled(false)
    .omitted(false)
    .linkType('Asset');

  manuscriptVersions
    .createField('additionalFiles')
    .name('Additional Files')
    .type('Array')
    .localized(false)
    .required(false)
    .disabled(false)
    .omitted(false)
    .items({
      type: 'Link',

      validations: [
        {
          linkMimetypeGroup: ['pdfdocument', 'spreadsheet'],
        },
      ],

      linkType: 'Asset',
    });
  manuscriptVersions.moveField('keyResourceTable').afterField('manuscriptFile');
  manuscriptVersions
    .moveField('additionalFiles')
    .afterField('keyResourceTable');
};

module.exports.down = (migration) => {
  const manuscriptVersions = migration.editContentType('manuscriptVersions');
  manuscriptVersions.deleteField('keyResourceTable');
  manuscriptVersions.deleteField('additionalFiles');
};
