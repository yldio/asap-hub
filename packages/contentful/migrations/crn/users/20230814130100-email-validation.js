module.exports.description = 'Change email validation';

module.exports.up = (migration) => {
  const users = migration.editContentType('users');
  users.editField('email').validations([
    {
      regexp: {
        pattern: "^\\w[\\w.\\-+']*@([\\w-]+\\.)+[\\w-]+$",
        flags: null,
      },
    },
  ]);
  users.editField('contactEmail').validations([
    {
      regexp: {
        pattern: "^\\w[\\w.\\-+']*@([\\w-]+\\.)+[\\w-]+$",
        flags: null,
      },
    },
  ]);
};

module.exports.down = (migration) => {
  const users = migration.editContentType('users');
  users.editField('email').validations([
    {
      regexp: {
        pattern: '^\\w[\\w.\\-+]*@([\\w-]+\\.)+[\\w-]+$',
        flags: null,
      },
    },
  ]);
  users.editField('contactEmail').validations([
    {
      regexp: {
        pattern: '^\\w[\\w.\\-+]*@([\\w-]+\\.)+[\\w-]+$',
        flags: null,
      },
    },
  ]);
};
