module.exports.description = 'Create Compliance Reports content model';

module.exports.up = (migration) => {
  const complianceReports = migration
    .createContentType('complianceReports')
    .name('Compliance Reports')
    .description('')
    .displayField('url');

  complianceReports
    .createField('url')
    .name('URL')
    .type('Symbol')
    .localized(false)
    .required(true)
    .validations([
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

  complianceReports
    .createField('description')
    .name('Description')
    .type('Text')
    .localized(false)
    .required(true)
    .validations([])
    .disabled(false)
    .omitted(false);

  complianceReports
    .createField('manuscriptVersion')
    .name('Manuscript Version')
    .type('Link')
    .localized(false)
    .required(true)
    .validations([
      {
        linkContentType: ['manuscriptVersions'],
      },
    ])
    .disabled(false)
    .omitted(false)
    .linkType('Entry');

  complianceReports.changeFieldControl(
    'manuscriptVersion',
    'builtin',
    'entryLinkEditor',
    {
      showLinkEntityAction: true,
      showCreateEntityAction: false,
    },
  );
};

module.exports.down = (migration) => {
  migration.deleteContentType('complianceReports');
};
