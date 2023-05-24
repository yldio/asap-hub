module.exports.description = 'Add orcid works field to users content type';

module.exports.up = (migration) => {
  const users = migration.editContentType('users');
  users
    .createField('orcidWorks')
    .name('Orcid Works')
    .type('Object')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);

  users.moveField('orcidWorks').afterField('orcidLastModifiedDate');
  users.changeFieldControl('orcidWorks', 'app', '2finDNk15g5UtOq4DaLNxv', {});
};

module.exports.down = (migration) => {
  const users = migration.editContentType('users');
  users.deleteField('orcidWorks');
};
