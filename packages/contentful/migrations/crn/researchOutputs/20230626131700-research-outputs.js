module.exports.description = 'Create research outputs content model';

module.exports.up = function (migration) {
  const researchOutputs = migration
    .createContentType('researchOutputs')
    .name('Research Outputs')
    .description('')
    .displayField('title');

  researchOutputs
    .createField('title')
    .name('Title')
    .type('Symbol')
    .localized(false)
    .required(true)
    .validations([])
    .disabled(false)
    .omitted(false);

  researchOutputs
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

  researchOutputs
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

  researchOutputs
    .createField('createdDate')
    .name('Created Date')
    .type('Date')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);

  researchOutputs
    .createField('addedDate')
    .name('Added Date')
    .type('Date')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);

  researchOutputs
    .createField('lastUpdatedPartial')
    .name('Last updated (partial)')
    .type('Date')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);

  researchOutputs
    .createField('createdBy')
    .name('Created By')
    .type('Link')
    .localized(false)
    .required(false)
    .disabled(false)
    .omitted(false)
    .validations([
      {
        linkContentType: ['users'],
      },
    ])
    .linkType('Entry');

  researchOutputs
    .createField('updatedBy')
    .name('Updated By')
    .type('Link')
    .localized(false)
    .required(false)
    .disabled(false)
    .omitted(false)
    .validations([
      {
        linkContentType: ['users'],
      },
    ])
    .linkType('Entry');

  researchOutputs
    .createField('reviewRequestedBy')
    .name('Review Requested By')
    .type('Link')
    .localized(false)
    .required(false)
    .disabled(false)
    .omitted(false)
    .validations([
      {
        linkContentType: ['users'],
      },
    ])
    .linkType('Entry');

  researchOutputs
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

  researchOutputs
    .createField('description')
    .name('Description')
    .type('RichText')
    .localized(false)
    .required(false)
    .validations([
      {
        enabledMarks: [
          'bold',
          'italic',
          'underline',
          'code',
          'subscript',
          'superscript',
        ],
        message: 'Only bold, italic, underline, and code marks are allowed',
      },
      {
        enabledNodeTypes: [
          'heading-1',
          'heading-2',
          'heading-3',
          'heading-4',
          'heading-5',
          'heading-6',
          'ordered-list',
          'unordered-list',
          'hr',
          'blockquote',
          'embedded-entry-block',
          'embedded-asset-block',
          'hyperlink',
          'entry-hyperlink',
          'asset-hyperlink',
          'embedded-entry-inline',
        ],

        message:
          'Only heading 1, heading 2, heading 3, heading 4, heading 5, heading 6, ordered list, unordered list, horizontal rule, quote, block entry, asset, link to Url, link to entry, link to asset, and inline entry nodes are allowed',
      },
      {
        nodes: {
          'asset-hyperlink': [
            {
              size: {
                max: 10,
              },

              message: null,
            },
          ],

          'embedded-asset-block': [
            {
              size: {
                max: 10,
              },

              message: '',
            },
          ],

          'embedded-entry-block': [
            {
              size: {
                max: 10,
              },

              message: '',
            },
          ],

          'embedded-entry-inline': [
            {
              size: {
                max: 10,
              },

              message: null,
            },
          ],

          'entry-hyperlink': [
            {
              size: {
                max: 10,
              },

              message: null,
            },
          ],
        },
      },
    ])
    .disabled(true)
    .omitted(false);

  researchOutputs
    .createField('descriptionMD')
    .name('Description')
    .type('Text')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);

  researchOutputs
    .createField('methods')
    .name('Methods')
    .type('Array')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false)
    .items({
      type: 'Link',

      validations: [
        {
          linkContentType: ['researchTags'],
        },
      ],

      linkType: 'Entry',
    });

  researchOutputs
    .createField('organisms')
    .name('Organism')
    .type('Array')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false)
    .items({
      type: 'Link',

      validations: [
        {
          linkContentType: ['researchTags'],
        },
      ],

      linkType: 'Entry',
    });

  researchOutputs
    .createField('environments')
    .name('Environment')
    .type('Array')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false)
    .items({
      type: 'Link',

      validations: [
        {
          linkContentType: ['researchTags'],
        },
      ],

      linkType: 'Entry',
    });

  researchOutputs
    .createField('subtype')
    .name('Subtype')
    .type('Link')
    .localized(false)
    .required(false)
    .validations([
      {
        linkContentType: ['researchTags'],
      },
    ])
    .disabled(false)
    .omitted(false)
    .linkType('Entry');

  researchOutputs
    .createField('keywords')
    .name('Keywords')
    .type('Array')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false)
    .items({
      type: 'Link',

      validations: [
        {
          linkContentType: ['researchTags'],
        },
      ],

      linkType: 'Entry',
    });

  researchOutputs
    .createField('tags')
    .name('Tags')
    .type('Array')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false)
    .items({
      type: 'Symbol',
      validations: [],
    });

  researchOutputs
    .createField('usageNotes')
    .name('Usage Notes')
    .type('RichText')
    .localized(false)
    .required(false)
    .validations([
      {
        enabledMarks: [
          'bold',
          'italic',
          'underline',
          'code',
          'subscript',
          'superscript',
        ],
        message: 'Only bold, italic, underline, and code marks are allowed',
      },
      {
        enabledNodeTypes: [
          'heading-1',
          'heading-2',
          'heading-3',
          'heading-4',
          'heading-5',
          'heading-6',
          'ordered-list',
          'unordered-list',
          'hr',
          'blockquote',
          'embedded-entry-block',
          'embedded-asset-block',
          'hyperlink',
          'entry-hyperlink',
          'asset-hyperlink',
          'embedded-entry-inline',
        ],

        message:
          'Only heading 1, heading 2, heading 3, heading 4, heading 5, heading 6, ordered list, unordered list, horizontal rule, quote, block entry, asset, link to Url, link to entry, link to asset, and inline entry nodes are allowed',
      },
      {
        nodes: {
          'asset-hyperlink': [
            {
              size: {
                max: 10,
              },

              message: null,
            },
          ],

          'embedded-asset-block': [
            {
              size: {
                max: 10,
              },

              message: '',
            },
          ],

          'embedded-entry-block': [
            {
              size: {
                max: 10,
              },

              message: '',
            },
          ],

          'embedded-entry-inline': [
            {
              size: {
                max: 10,
              },

              message: null,
            },
          ],

          'entry-hyperlink': [
            {
              size: {
                max: 10,
              },

              message: null,
            },
          ],
        },
      },
    ])
    .disabled(true)
    .omitted(false);

  researchOutputs
    .createField('teams')
    .name('Teams')
    .type('Array')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false)
    .items({
      type: 'Link',

      validations: [
        {
          linkContentType: ['teams'],
        },
      ],

      linkType: 'Entry',
    });

  researchOutputs
    .createField('workingGroup')
    .name('WorkingGroup')
    .type('Link')
    .localized(false)
    .required(false)
    .disabled(false)
    .omitted(false)
    .validations([
      {
        linkContentType: ['workingGroups'],
      },
    ])
    .linkType('Entry');

  researchOutputs
    .createField('labs')
    .name('Labs')
    .type('Array')
    .localized(false)
    .required(false)
    .disabled(false)
    .omitted(false)
    .items({
      type: 'Link',

      validations: [
        {
          linkContentType: ['labs'],
        },
      ],

      linkType: 'Entry',
    });

  researchOutputs
    .createField('authors')
    .name('Authors')
    .type('Array')
    .localized(false)
    .required(false)
    .disabled(false)
    .omitted(false)
    .items({
      type: 'Link',

      validations: [
        {
          linkContentType: ['users', 'externalAuthors'],
        },
      ],

      linkType: 'Entry',
    });

  researchOutputs
    .createField('relatedResearch')
    .name('Related Research')
    .type('Array')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false)
    .items({
      type: 'Link',

      validations: [
        {
          linkContentType: ['researchOutputs'],
        },
      ],

      linkType: 'Entry',
    });

  researchOutputs
    .createField('asapFunded')
    .name('ASAP Funded')
    .type('Symbol')
    .localized(false)
    .required(true)
    .validations([
      {
        in: ['Yes', 'No', 'Not Sure'],
      },
    ])
    .disabled(false)
    .omitted(false);

  researchOutputs
    .createField('sharingStatus')
    .name('Sharing Status')
    .type('Symbol')
    .localized(false)
    .required(true)
    .validations([
      {
        in: ['Public', 'Network Only'],
      },
    ])
    .disabled(false)
    .omitted(false);

  researchOutputs
    .createField('usedInAPublication')
    .name('Used in a Publication')
    .type('Symbol')
    .localized(false)
    .required(true)
    .validations([
      {
        in: ['Yes', 'No', 'Not Sure'],
      },
    ])
    .disabled(false)
    .omitted(false);

  researchOutputs
    .createField('publishDate')
    .name('Publish Date')
    .type('Date')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);

  researchOutputs
    .createField('rrid')
    .name('Identifier (RRID)')
    .type('Symbol')
    .localized(false)
    .required(false)
    .validations([
      {
        regexp: {
          pattern: '^RRID:[a-zA-Z]+.+$',
          flags: null,
        },
        message: 'This must start with "RRID:"',
      },
    ])
    .disabled(false)
    .omitted(false);

  researchOutputs
    .createField('accession')
    .name('Identifier (Accession #)')
    .type('Symbol')
    .localized(false)
    .required(false)
    .validations([
      {
        regexp: {
          pattern: '^(w+d+(.d+)?)|(NP_d+)$',
          flags: null,
        },
        message: 'This must start with a letter',
      },
    ])
    .disabled(false)
    .omitted(false);

  researchOutputs
    .createField('doi')
    .name('Identifier (DOI)')
    .type('Symbol')
    .localized(false)
    .required(false)
    .validations([
      {
        regexp: {
          pattern: '^(doi:)?d{2}.d{4}.*$',
          flags: null,
        },
        message: 'DOIs must start with a number and cannot be a URL',
      },
    ])
    .disabled(false)
    .omitted(false);

  researchOutputs
    .createField('labCatalogNumber')
    .name('Lab Catalog Number')
    .type('Symbol')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);

  researchOutputs
    .createField('adminNotes')
    .name('Admin Notes')
    .type('Text')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);

  researchOutputs.changeFieldControl('adminNotes', 'builtin', 'multipleLine', {
    helpText:
      "This is ASAP internal content and it's not being shown on the Hub",
  });
};

module.exports.down = (migration) => {
  migration.deleteContentType('researchOutputs');
};
