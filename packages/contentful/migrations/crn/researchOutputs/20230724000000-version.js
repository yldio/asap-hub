module.exports.description = 'Add RO Versions';

module.exports.up = function (migration) {
  const versions = migration
    .createContentType('researchOutputVersions')
    .name('Research Output Versions')
    .description('')
    .displayField('title');

  versions
    .createField('title')
    .name('Title')
    .type('Symbol')
    .localized(false)
    .required(true)
    .validations([])
    .disabled(false)
    .omitted(false);

  versions
    .createField('documentType')
    .name('Document Type')
    .type('Symbol')
    .localized(false)
    .required(true)
    .validations([
      {
        in: [
          'Grant Document',
          'Presentation',
          'Protocol',
          'Dataset',
          'Bioinformatics',
          'Lab Resource',
          'Article',
          'Report',
        ],
      },
    ])
    .disabled(false)
    .omitted(false);

  versions
    .createField('type')
    .name('Type')
    .type('Symbol')
    .localized(false)
    .required(false)
    .validations([
      {
        in: [
          '3D Printing',
          'ASAP annual meeting',
          'ASAP subgroup meeting',
          'Analysis',
          'Animal Model',
          'Antibody',
          'Assay',
          'Behavioral',
          'Biosample',
          'Cell Culture & Differentiation',
          'Cell line',
          'Cloning',
          'Code',
          'Compound',
          'Data portal',
          'Electrophysiology',
          'External meeting',
          'Genetic Data - DNA',
          'Genetic Data - RNA',
          'Genotyping',
          'Microscopy',
          'Microscopy & Imaging',
          'Model System',
          'Plasmid',
          'Preprint',
          'Proposal',
          'Protein Data',
          'Protein expression',
          'Published',
          'Report',
          'Sample Prep',
          'Shipment Procedure',
          'Software',
          'Sequencing',
          'Spectroscopy',
          'Team meeting',
          'Viral Vector',
        ],
      },
    ])
    .disabled(false)
    .omitted(false);

  versions
    .createField('addedDate')
    .name('Added Date')
    .type('Date')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);

  versions
    .createField('link')
    .name('Link')
    .type('Symbol')
    .localized(false)
    .required(false)
    .validations([
      {
        unique: true,
      },
      {
        regexp: {
          pattern:
            '^(ftp|http|https):\\/\\/(\\w+:{0,1}\\w*@)?(\\S+)(:[0-9]+)?(\\/|\\/([\\w#!:.?+=&%@!\\-/]))?$',
          flags: null,
        },
      },
    ])
    .disabled(false)
    .omitted(false);

  const researchOutputs = migration.editContentType('researchOutputs');

  researchOutputs
    .createField('versions')
    .name('Versions')
    .type('Array')
    .localized(false)
    .required(false)
    .disabled(false)
    .omitted(false)
    .items({
      type: 'Link',
      validations: [
        {
          linkContentType: ['researchOutputVersions'],
        },
      ],
      linkType: 'Entry',
    });
};

module.exports.down = (migration) => {
  const researchOutputs = migration.editContentType('researchOutputs');
  researchOutputs.deleteField('versions');
  migration.deleteContentType('researchOutputVersions');
};
