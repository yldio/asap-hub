module.exports.description = 'Updates fields on tutorials model';

module.exports.up = (migration) => {
  const tutorials = migration.editContentType('tutorials');
  tutorials.changeFieldId('publishDate', 'addedDate');
  tutorials.editField('addedDate').name('Added Date').required(false);

  tutorials
    .createField('lastUpdated')
    .name('Last Updated')
    .type('Date')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);

  tutorials.changeFieldControl('lastUpdated', 'app', 'v97H7wgmtstfxNheYWy0G', {
    exclude: 'addedDate',
  });

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

  tutorials.moveField('addedDate').toTheTop();
  tutorials.moveField('lastUpdated').afterField('addedDate');
  tutorials.moveField('tags').afterField('text');
  tutorials.moveField('authors').afterField('tags');
  tutorials.moveField('teams').afterField('authors');
  tutorials.moveField('relatedTutorials').afterField('teams');
  tutorials.moveField('relatedEvents').afterField('relatedTutorials');
  tutorials.moveField('asapFunded').afterField('relatedEvents');
  tutorials.moveField('usedInAPublication').afterField('asapFunded');
  tutorials.moveField('sharingStatus').afterField('usedInAPublication');
  tutorials.moveField('datePublished').afterField('sharingStatus');
};

module.exports.down = (migration) => {
  const tutorials = migration.editContentType('tutorials');
  tutorials.deleteField('authors');
  tutorials.deleteField('teams');
  tutorials.changeFieldId('addedDate', 'publishDate');
  tutorials.editField('publishDate').name('Publish Date').required(true);
  tutorials.deleteField('lastUpdated');
  tutorials.deleteField('datePublished');
  tutorials.deleteField('tags');
  tutorials.deleteField('relatedTutorials');
  tutorials.deleteField('relatedEvents');
  tutorials.deleteField('asapFunded');
  tutorials.deleteField('usedInAPublication');
  tutorials.deleteField('sharingStatus');
};
