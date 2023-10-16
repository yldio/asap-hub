module.exports.description = 'adds study link';

module.exports.up = (migration) => {
  const contributingCohorts = migration.editContentType('contributingCohorts');

  contributingCohorts
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

  contributingCohorts.changeFieldControl(
    'studyLink',
    'builtin',
    'urlEditor',
    {},
  );
};

module.exports.down = (migration) => {
  const contributingCohorts = migration.editContentType('contributingCohorts');
  contributingCohorts.deleteContentType('studyLink');
};
