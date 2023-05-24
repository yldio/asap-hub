module.exports.description = 'Updates workingGroups email validation';

module.exports.up = (migration) => {
  const workingGroups = migration.editContentType('workingGroups');
  workingGroups.editField('primaryEmail').validations([
    {
      unique: false,
    },
    {
      regexp: {
        pattern: '^\\w[\\w.\\-+]*@([\\w-]+\\.)+[\\w-]+$',
        flags: null,
      },
    },
  ]);
  workingGroups.editField('secondaryEmail').validations([
    {
      unique: false,
    },
    {
      regexp: {
        pattern: '^\\w[\\w.\\-+]*@([\\w-]+\\.)+[\\w-]+$',
        flags: null,
      },
    },
  ]);
};

module.exports.down = (migration) => {
  const workingGroups = migration.editContentType('workingGroups');
  workingGroups.editField('primaryEmail').validations([
    {
      unique: true,
    },
    {
      regexp: {
        pattern: '^\\w[\\w.\\-+]*@([\\w-]+\\.)+[\\w-]+$',
        flags: null,
      },
    },
  ]);
  workingGroups.editField('secondaryEmail').validations([
    {
      unique: true,
    },
    {
      regexp: {
        pattern: '^\\w[\\w.\\-+]*@([\\w-]+\\.)+[\\w-]+$',
        flags: null,
      },
    },
  ]);
};
