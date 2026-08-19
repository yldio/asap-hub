module.exports.description =
  'Remove the user link from socials now that users link to their socials';

module.exports.up = (migration) => {
  const socials = migration.editContentType('socials');

  socials.deleteField('user');
};

module.exports.down = (migration) => {
  const socials = migration.editContentType('socials');

  socials
    .createField('user')
    .name('User')
    .type('Link')
    .localized(false)
    .required(true)
    .validations([{ linkContentType: ['users'] }])
    .disabled(false)
    .omitted(false)
    .linkType('Entry');

  socials.changeFieldControl('user', 'builtin', 'entryLinkEditor', {
    showLinkEntityAction: true,
    showCreateEntityAction: false,
  });
};
