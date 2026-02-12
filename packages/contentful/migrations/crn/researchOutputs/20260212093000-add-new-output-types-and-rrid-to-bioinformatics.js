module.exports.description =
  'Add Material Generation, Clinical, and Computational Model to Output types';

module.exports.up = (migration) => {
  const newTypes = [
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
    'Clinical',
    'Cloning',
    'Code',
    'Compound',
    'Computational Model',
    'Data portal',
    'Electrophysiology',
    'External meeting',
    'Genetic Data - DNA',
    'Genetic Data - RNA',
    'Genotyping',
    'Material Generation',
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
  ];

  const researchOutputs = migration.editContentType('researchOutputs');
  researchOutputs.editField('type').validations([{ in: newTypes }]);

  const researchOutputVersions = migration.editContentType(
    'researchOutputVersions',
  );
  researchOutputVersions.editField('type').validations([{ in: newTypes }]);
};

module.exports.down = (migration) => {
  const oldTypes = [
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
  ];

  const researchOutputs = migration.editContentType('researchOutputs');
  researchOutputs.editField('type').validations([{ in: oldTypes }]);

  const researchOutputVersions = migration.editContentType(
    'researchOutputVersions',
  );
  researchOutputVersions.editField('type').validations([{ in: oldTypes }]);
};
