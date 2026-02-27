module.exports.description =
  'Create authors field and migrate first, corresponding and additional authors';

module.exports.up = (migration) => {
  const manuscriptVersions = migration.editContentType('manuscriptVersions');
  manuscriptVersions
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

  manuscriptVersions.moveField('authors').afterField('teams');

  migration.transformEntries({
    contentType: 'manuscriptVersions',
    from: ['firstAuthors', 'additionalAuthors', 'correspondingAuthor'],
    to: ['authors'],
    transformEntryForLocale: (fromFields, locale) => {
      const mergedAuthors = [
        ...(fromFields.firstAuthors?.[locale] || []),
        ...(fromFields.additionalAuthors?.[locale] || []),
        ...(fromFields.correspondingAuthor?.[locale] || []),
      ];

      const seenIds = new Set();
      const uniqueAuthorList = mergedAuthors.filter((author) => {
        if (!author?.sys?.id) return false;
        if (seenIds.has(author.sys.id)) return false;
        seenIds.add(author.sys.id);
        return true;
      });

      return {
        authors: uniqueAuthorList.length ? uniqueAuthorList : undefined,
      };
    },
  });
};

module.exports.down = (migration) => {
  const manuscriptVersions = migration.editContentType('manuscriptVersions');
  manuscriptVersions.deleteField('authors');
};
