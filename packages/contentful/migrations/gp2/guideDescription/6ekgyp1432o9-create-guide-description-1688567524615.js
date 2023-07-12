module.exports.description = 'Create guide model';

module.exports.up = (migration) => {
  const guideDescription = migration
    .createContentType('guideDescription')
    .name('Guide Description')
    .description('')
    .displayField('bodyText');
  guideDescription
    .createField('title')
    .name('Title')
    .type('Symbol')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);
  guideDescription
    .createField('bodyText')
    .name('Body Text')
    .type('Text')
    .localized(false)
    .required(true)
    .validations([])
    .disabled(false)
    .omitted(false);
  guideDescription
    .createField('linkUrl')
    .name('Link URL')
    .type('Symbol')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);
  guideDescription
    .createField('linkText')
    .name('Link Text')
    .type('Symbol')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);
  guideDescription.changeFieldControl('title', 'builtin', 'singleLine', {});
  guideDescription.changeFieldControl('bodyText', 'builtin', 'markdown', {});
  guideDescription.changeFieldControl('linkUrl', 'builtin', 'urlEditor', {});
  guideDescription.changeFieldControl('linkText', 'builtin', 'singleLine', {});
};

module.exports.down = (migration) => {
  migration.deleteContentType('guide');
};
