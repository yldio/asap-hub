module.exports.description = 'Create latest stats content model';

module.exports.up = function (migration) {
  const latestStats = migration
    .createContentType('latestStats')
    .name('Latest Stats')
    .description('');

  latestStats
    .createField('sampleCount')
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

  latestStats.changeFieldControl('sampleCount', 'builtin', 'numberEditor', {});
  latestStats.changeFieldControl('cohortCount', 'builtin', 'numberEditor', {});
  latestStats.changeFieldControl('articleCount', 'builtin', 'numberEditor', {});
};

module.exports.down = (migration) => {
  migration.deleteContentType('latestStats');
};
