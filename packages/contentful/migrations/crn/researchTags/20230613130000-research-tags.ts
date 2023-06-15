module.exports.description = 'Create research tags content model';

module.exports.up = function (migration) {
  const researchTags = migration
    .createContentType('researchTags')
    .name('Research Tags')
    .description('')
    .displayField('name');

  researchTags
    .createField('name')
    .name('Name')
    .type('Symbol')
    .localized(false)
    .required(true)
    .validations([])
    .disabled(false)
    .omitted(false);

  researchTags
    .createField('category')
    .name('Category')
    .type('Symbol')
    .localized(false)
    .required(false)
    .validations([
      {
        in: ['Method', 'Organism', 'Environment', 'Subtype', 'Keyword'],
      },
    ])
    .disabled(false)
    .omitted(false);

  researchTags
    .createField('types')
    .name('Types')
    .type('Array')
    .localized(false)
    .required(false)
    .disabled(false)
    .omitted(false)
    .items({
      type: 'Symbol',
      validations: [
        {
          in: [
            'Preprint',
            'Published',
            'Code',
            'Data portal',
            'Software',
            'Behavioral',
            'Electrophysiology',
            'Genetic Data - DNA',
            'Genetic Data - RNA',
            'Spectroscopy',
            'Microscopy & Imaging',
            'Protein Data',
            'Proposal',
            'Report',
            'Assay',
            'Animal Model',
            'Antibody',
            'Biosample',
            'Cell line',
            'Compound',
            'Plasmid',
            'Viral Vector',
            'ASAP Annual meeting',
            'ASAP subgroup meeting',
            'External meeting',
            'Team meeting',
            '3D Printing',
            'Analysis',
            'Cell Culture & Differentiation',
            'Cloning',
            'Genotyping',
            'Model System',
            'Protein Expression',
            'Sample Prep',
            'Shipment Procedure',
            'Sequencing',
          ],
        },
      ],
    });

  researchTags
    .createField('entities')
    .name('Entities')
    .type('Array')
    .localized(false)
    .required(false)
    .disabled(false)
    .omitted(false)
    .items({
      type: 'Symbol',
      validations: [
        {
          in: ['Research Output', 'User'],
        },
      ],
    });

  researchTags.changeFieldControl('name', 'builtin', 'singleLine', {});
  researchTags.changeFieldControl('category', 'builtin', 'dropdown', {});
  researchTags.changeFieldControl('types', 'builtin', 'checkbox', {});
  researchTags.changeFieldControl('entities', 'builtin', 'checkbox', {});
};

module.exports.down = (migration) => {
  migration.deleteContentType('researchTags');
};
