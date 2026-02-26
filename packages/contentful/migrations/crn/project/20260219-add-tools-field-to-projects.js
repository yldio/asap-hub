module.exports.description =
  'Add External Tools field to Projects content model';

module.exports.up = (migration) => {
  const projects = migration.editContentType('projects');

  projects
    .createField('tools')
    .name('External Tools')
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
          linkContentType: ['externalTools'],
        },
      ],
      linkType: 'Entry',
    });

  projects.changeFieldControl('tools', 'builtin', 'entryLinksEditor', {});
};

module.exports.down = (migration) => {
  const projects = migration.editContentType('projects');
  projects.deleteField('tools');
};
