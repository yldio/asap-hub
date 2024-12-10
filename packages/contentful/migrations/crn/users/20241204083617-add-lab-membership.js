const { v4: uuid } = require('uuid');

module.exports.description = 'Add Lab Membership';

module.exports.up = (migration) => {
  const labMembership = migration
    .createContentType('labMembership')
    .name('Lab Membership')
    .description('')
    .displayField('role');

  labMembership
    .createField('lab')
    .name('Lab')
    .type('Link')
    .localized(false)
    .required(true)
    .validations([
      {
        linkContentType: ['labs'],
      },
    ])
    .disabled(false)
    .omitted(false)
    .linkType('Entry');

  labMembership
    .createField('role')
    .name('Role')
    .type('Symbol')
    .localized(false)
    .required(false)
    .validations([
      {
        in: ['Co-PI', 'Lead PI', 'Collaborating PI'],
      },
    ])
    .disabled(false)
    .omitted(false);

  labMembership.changeFieldControl('lab', 'builtin', 'entryLinkEditor', {
    showLinkEntityAction: true,
    showCreateEntityAction: true,
  });

  labMembership.changeFieldControl('role', 'builtin', 'dropdown', {});

  const users = migration.editContentType('users');

  users.changeFieldId('labs', 'labs_old');
  users.editField('labs_old').name('Deprecated Labs');

  users
    .createField('labs')
    .name('Labs')
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
          linkContentType: ['labMembership'],
        },
      ],

      linkType: 'Entry',
    });

  users.moveField('labs').afterField('labs_old');

  migration.deriveLinkedEntries({
    contentType: 'users',
    from: ['labs_old'],
    toReferenceField: 'labs',
    derivedContentType: 'labMembership',
    derivedFields: ['lab'],
    identityKey: async () => {
      return uuid();
    },
    deriveEntryForLocale: (userEntry, locale) => {
      const userLabs = userEntry.labs_old?.[locale] || [];
      if (!userLabs.length) {
        return;
      }
      // it can only create one entry
      // the rest will be populated with a migration
      const link = userLabs[0];
      return {
        lab: {
          sys: {
            type: 'Link',
            linkType: 'Entry',
            id: link.sys.id,
          },
        },
      };
    },
    shouldPublish: true,
  });
};

module.exports.down = (migration) => {
  migration.deleteContentType('labMembership');

  const users = migration.editContentType('users');
  users.deleteField('labs');
  users.changeFieldId('labs_old', 'labs');
};
