const SOCIAL_FIELDS = [
  'website1',
  'website2',
  'linkedIn',
  'researcherId',
  'twitter',
  'github',
  'googleScholar',
  'researchGate',
  'blueSky',
];

const URL_VALIDATION = {
  regexp: {
    pattern:
      '^(ftp|http|https):\\/\\/(\\w+:{0,1}\\w*@)?(\\S+)(:[0-9]+)?(\\/|\\/([\\w#!:.?+=&%@!\\-/]))?$',
    flags: null,
  },
};

const FIELD_DEFINITIONS = {
  website1: { name: 'Website 1', validations: [URL_VALIDATION] },
  website2: { name: 'Website 2', validations: [URL_VALIDATION] },
  linkedIn: { name: 'LinkedIn', validations: [] },
  researcherId: { name: 'Researcher ID', validations: [] },
  twitter: { name: 'Twitter', validations: [] },
  github: { name: 'Github', validations: [] },
  googleScholar: { name: 'Google Scholar', validations: [] },
  researchGate: { name: 'Research Gate', validations: [] },
  blueSky: { name: 'BlueSky', validations: [] },
};

module.exports.description =
  'Replace the flat social fields on users with a link to socials';

module.exports.up = (migration) => {
  const users = migration.editContentType('users');

  // Deleting first frees the field slots the users content type needs to stay
  // within Contentful's 50-field limit. deleteField ends its batch group, so
  // the deletions are applied before socials is created.
  SOCIAL_FIELDS.forEach((field) => {
    users.deleteField(field);
  });

  users
    .createField('userSocials')
    .name('Socials')
    .type('Link')
    .localized(false)
    .required(false)
    .validations([{ linkContentType: ['socials'] }])
    .disabled(false)
    .omitted(false)
    .linkType('Entry');

  users.changeFieldControl('userSocials', 'builtin', 'entryLinkEditor', {
    showLinkEntityAction: false,
    showCreateEntityAction: true,
  });

  users.moveField('userSocials').afterField('avatar');
};

module.exports.down = (migration) => {
  const users = migration.editContentType('users');

  users.deleteField('userSocials');

  SOCIAL_FIELDS.forEach((field) => {
    const { name, validations } = FIELD_DEFINITIONS[field];

    users
      .createField(field)
      .name(name)
      .type('Symbol')
      .localized(false)
      .required(false)
      .validations(validations)
      .disabled(false)
      .omitted(false);

    users.changeFieldControl(
      field,
      'builtin',
      validations.length ? 'urlEditor' : 'singleLine',
      {},
    );
  });
};
