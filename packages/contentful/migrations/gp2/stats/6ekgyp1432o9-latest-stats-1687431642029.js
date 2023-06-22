module.exports = function (migration) {
  const latestStats = migration
    .createContentType('latestStats')
    .name('Latest Stats')
    .description('');

  latestStats
    .createField('samplesCount')
    .name('Number of samples')
    .type('Integer')
    .localized(false)
    .required(true)
    .validations([])
    .defaultValue({
      'en-US': 0,
    })
    .disabled(false)
    .omitted(false);

  latestStats
    .createField('cohortCount')
    .name('Number of cohorts')
    .type('Integer')
    .localized(false)
    .required(true)
    .validations([])
    .defaultValue({
      'en-US': 0,
    })
    .disabled(false)
    .omitted(false);

  latestStats
    .createField('articleCount')
    .name('Number of articles')
    .type('Integer')
    .localized(false)
    .required(true)
    .validations([])
    .defaultValue({
      'en-US': 0,
    })
    .disabled(false)
    .omitted(false);

  latestStats.changeFieldControl('samplesCount', 'builtin', 'numberEditor', {});
  latestStats.changeFieldControl('cohortCount', 'builtin', 'numberEditor', {});
  latestStats.changeFieldControl('articleCount', 'builtin', 'numberEditor', {});
};
