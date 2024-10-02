module.exports.description = 'Add description and authors';

module.exports.up = (migration) => {
  const manuscriptVersions = migration.editContentType('manuscriptVersions');

  manuscriptVersions
    .createField('description')
    .name('Description')
    .type('Text')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);

  manuscriptVersions.changeFieldControl(
    'description',
    'builtin',
    'multipleLine',
  );

  manuscriptVersions.moveField('description').afterField('otherDetails');

  manuscriptVersions
    .createField('firstAuthors')
    .name('First Authors')
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

  manuscriptVersions.moveField('firstAuthors').afterField('teams');

  manuscriptVersions
    .createField('correspondingAuthor')
    .name('Corresponding Author')
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

  manuscriptVersions.moveField('correspondingAuthor').afterField('labs');

  manuscriptVersions
    .createField('additionalAuthors')
    .name('Additional Authors')
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

  manuscriptVersions
    .moveField('additionalAuthors')
    .afterField('correspondingAuthor');
};

module.exports.down = (migration) => {
  const manuscriptVersions = migration.editContentType('manuscriptVersions');
  manuscriptVersions.deleteField('description');
  manuscriptVersions.deleteField('firstAuthors');
  manuscriptVersions.deleteField('correspondingAuthor');
  manuscriptVersions.deleteField('additionalAuthors');
};
