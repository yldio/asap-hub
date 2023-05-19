module.exports.description = 'Updates role';

module.exports.up = (migration) => {
  const workingGroups = migration.editContentType('workingGroups');

  workingGroups.editField('members').items({
    type: 'Link',
    validations: [
      {
        linkContentType: ['workingGroupMembership'],
      },
    ],

    linkType: 'Entry',
  });
};

module.exports.down = (migration) => {
  const workingGroups = migration.editContentType('workingGroups');
  workingGroups.editField('workingGroups').items({
    type: 'Link',
    validations: [
      {
        linkContentType: [],
      },
    ],
  });
};
