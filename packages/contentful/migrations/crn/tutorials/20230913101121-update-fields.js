module.exports.description = 'Updates fields on tutorials model';

module.exports.up = (migration) => {
  const tutorials = migration.editContentType('tutorials');
  tutorials
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

  tutorials
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

  tutorials
    .createField('addedDate')
    .name('Added Date')
    .type('Date')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);

  tutorials
    .createField('lastUpdated')
    .name('Last Updated')
    .type('Date')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);

  tutorials
    .createField('datePublished')
    .name('Date Published')
    .type('Date')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);

  tutorials
    .createField('tags')
    .name('Tags')
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

  tutorials
    .createField('relatedTutorials')
    .name('Related Tutorials')
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
          linkContentType: ['tutorials'],
        },
      ],

      linkType: 'Entry',
    });

  tutorials
    .createField('relatedEvents')
    .name('Related Events')
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
          linkContentType: ['events'],
        },
      ],

      linkType: 'Entry',
    });

  tutorials
    .createField('asapFunded')
    .name('ASAP Funded')
    .type('Symbol')
    .localized(false)
    .required(false)
    .validations([
      {
        in: ['Yes', 'No', "Don't Know"],
      },
    ])
    .disabled(false)
    .omitted(false);

  tutorials
    .createField('usedInAPublication')
    .name('Used in a Publication')
    .type('Symbol')
    .localized(false)
    .required(false)
    .validations([
      {
        in: ['Yes', 'No', "Don't Know"],
      },
    ])
    .disabled(false)
    .omitted(false);

  tutorials
    .createField('sharingStatus')
    .name('Sharing Status')
    .type('Symbol')
    .localized(false)
    .required(false)
    .validations([
      {
        in: ['Public', 'Network Only'],
      },
    ])
    .disabled(false)
    .omitted(false);
};

module.exports.down = (migration) => {
  const tutorials = migration.editContentType('tutorials');
  tutorials.deleteField('authors');
  tutorials.deleteField('teams');
  tutorials.deleteField('addedDate');
  tutorials.deleteField('lastUpdated');
  tutorials.deleteField('datePublished');
  tutorials.deleteField('tags');
  tutorials.deleteField('relatedTutorials');
  tutorials.deleteField('relatedEvents');
  tutorials.deleteField('asapFunded');
  tutorials.deleteField('usedInAPublication');
  tutorials.deleteField('sharingStatus');
};
