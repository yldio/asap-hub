module.exports.description = 'Renames lab membership reference (labs to oldLabs) and creates new labs field (references labs) adds PI field';

module.exports.up = (migration) => {
  const labs = migration.editContentType('labs');

  labs.createField('labPI')
    .name('Lab PI')
    .type('Link')
    .linkType('Entry')
    .validations([
      {
        linkContentType: ['users'],
      },
    ]);

  const users = migration.editContentType('users');

  users.changeFieldId('labs', 'oldLabs');
  users.editField('oldLabs', { name: 'Old Labs' });
  users.createField('labs')
    .name('Labs')
    .type('Array')
    .items({
      type: 'Link',
      linkType: 'Entry',
      validations: [
        {
          linkContentType: ['labs'],
        },
      ],
    });
  users.moveField('labs').afterField('teams');
};

module.exports.down = (migration) => {
  const labs = migration.editContentType('labs');
  labs.deleteField('labPI');

  const users = migration.editContentType('users');
  users.deleteField('labs');
  users.changeFieldId('oldLabs', 'labs');
  users.editField('oldLabs', { name: 'Labs' });
  users.moveField('labs').afterField('teams');

};
