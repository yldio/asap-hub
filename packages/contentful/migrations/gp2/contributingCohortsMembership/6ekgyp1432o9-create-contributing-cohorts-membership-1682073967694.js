module.exports.description =
  'Create contributing cohorts membership content model';

module.exports.up = function (migration) {
  const contributingCohortsMembership = migration
    .createContentType('contributingCohortsMembership')
    .name('Contributing Cohorts Membership')
    .description('')
    .displayField('role');

  contributingCohortsMembership
    .createField('contributingCohort')
    .name('Contributing Cohort')
    .type('Link')
    .localized(false)
    .required(true)
    .validations([
      {
        linkContentType: ['contributingCohorts'],
      },
    ])
    .disabled(false)
    .omitted(false)
    .linkType('Entry');

  contributingCohortsMembership
    .createField('role')
    .name('Role')
    .type('Symbol')
    .localized(false)
    .required(true)
    .validations([
      {
        in: ['Investigator', 'Lead_Investigator', 'Co_Investigator'],
      },
    ])
    .disabled(false)
    .omitted(false);

  contributingCohortsMembership
    .createField('studyLink')
    .name('Study Link')
    .type('Symbol')
    .localized(false)
    .required(false)
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

  contributingCohortsMembership.changeFieldControl(
    'contributingCohort',
    'builtin',
    'entryLinkEditor',
    {
      showLinkEntityAction: true,
      showCreateEntityAction: false,
    },
  );

  contributingCohortsMembership.changeFieldControl(
    'role',
    'builtin',
    'dropdown',
    {},
  );
  contributingCohortsMembership.changeFieldControl(
    'studyLink',
    'builtin',
    'urlEditor',
    {},
  );
};

module.exports.down = (migration) => {
  migration.deleteContentType('contributingCohortsMembership');
};
