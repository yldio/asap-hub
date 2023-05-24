module.exports.description = 'Updates projects email validation';

module.exports.up = (migration) => {
  const projects = migration.editContentType('projects');
  projects.editField('pmEmail').validations([
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
  projects.editField('leadEmail').validations([
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
  const projects = migration.editContentType('projects');
  projects.editField('pmEmail').validations([
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
  projects.editField('leadEmail').validations([
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
