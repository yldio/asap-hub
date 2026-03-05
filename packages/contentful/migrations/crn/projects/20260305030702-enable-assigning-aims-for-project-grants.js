module.exports.description =
  'Enable assigning aims to project original and supplement grants and remove project milestones';

module.exports.up = (migration) => {
  const projects = migration.editContentType('projects');

  // Remove milestones from the Projects content type
  projects.deleteField('milestones');

  // Add Original Grant Aims (allow creating multiple Aims, no linking existing)
  projects
    .createField('originalGrantAims')
    .name('Original Grant Aims')
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
          linkContentType: ['aims'],
        },
      ],
      linkType: 'Entry',
    });

  projects.changeFieldControl(
    'originalGrantAims',
    'builtin',
    'entryLinksEditor',
    {
      showLinkEntityAction: false,
      showCreateEntityAction: true,
    },
  );

  projects.moveField('originalGrantAims').afterField('originalGrant');

  const supplementGrant = migration.editContentType('supplementGrant');

  // Add Aims to Supplement Grant (allow creating multiple Aims, no linking existing)
  supplementGrant
    .createField('aims')
    .name('Aims')
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
          linkContentType: ['aims'],
        },
      ],
      linkType: 'Entry',
    });

  supplementGrant.changeFieldControl('aims', 'builtin', 'entryLinksEditor', {
    showLinkEntityAction: false,
    showCreateEntityAction: true,
  });
};

module.exports.down = (migration) => {
  const supplementGrant = migration.editContentType('supplementGrant');
  supplementGrant.deleteField('aims');

  const projects = migration.editContentType('projects');

  // Remove Original Grant Aims field
  projects.deleteField('originalGrantAims');

  // Reintroduce milestones field on rollback with original configuration
  projects
    .createField('milestones')
    .name('Milestones')
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
          linkContentType: ['milestones'],
        },
      ],
      linkType: 'Entry',
    });
};
