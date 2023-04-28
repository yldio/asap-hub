module.exports.description = 'Create working group network content models';

module.exports.up = (migration) => {
  const workingGroupNetwork = migration
    .createContentType('workingGroupNetwork')
    .name('Working Group Network')
    .description('');

  workingGroupNetwork
    .createField('operational')
    .name('Operational Working Groups')
    .type('Array')
    .localized(false)
    .required(true)
    .validations([])
    .disabled(false)
    .omitted(false)
    .items({
      type: 'Link',
      validations: [
        {
          linkContentType: ['workingGroups'],
        },
      ],

      linkType: 'Entry',
    });

  workingGroupNetwork
    .createField('monogenic')
    .name('Monogenic Working Groups')
    .type('Array')
    .localized(false)
    .required(true)
    .validations([])
    .disabled(false)
    .omitted(false)
    .items({
      type: 'Link',
      validations: [
        {
          linkContentType: ['workingGroups'],
        },
      ],

      linkType: 'Entry',
    });

  workingGroupNetwork
    .createField('complexDisease')
    .name('Complex Disease Working Groups')
    .type('Array')
    .localized(false)
    .required(true)
    .validations([])
    .disabled(false)
    .omitted(false)
    .items({
      type: 'Link',
      validations: [
        {
          linkContentType: ['workingGroups'],
        },
      ],

      linkType: 'Entry',
    });
  workingGroupNetwork
    .createField('support')
    .name('Support Working Groups')
    .type('Array')
    .localized(false)
    .required(true)
    .validations([])
    .disabled(false)
    .omitted(false)
    .items({
      type: 'Link',
      validations: [
        {
          linkContentType: ['workingGroups'],
        },
      ],

      linkType: 'Entry',
    });
};

module.exports.down = (migration) => {
  migration.deleteContentType('workingGroupNetwork');
};
