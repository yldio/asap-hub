const URL_VALIDATION = {
  regexp: {
    pattern:
      '^(ftp|http|https):\\/\\/(\\w+:{0,1}\\w*@)?(\\S+)(:[0-9]+)?(\\/|\\/([\\w#!:.?+=&%@!\\-/]))?$',
    flags: null,
  },
};

const SOCIAL_FIELDS = [
  {
    id: 'website1',
    name: 'Website 1',
    validations: [URL_VALIDATION],
    widgetId: 'urlEditor',
  },
  {
    id: 'website2',
    name: 'Website 2',
    validations: [URL_VALIDATION],
    widgetId: 'urlEditor',
  },
  { id: 'linkedIn', name: 'LinkedIn', validations: [], widgetId: 'singleLine' },
  {
    id: 'researcherId',
    name: 'Researcher ID',
    validations: [],
    widgetId: 'singleLine',
  },
  { id: 'twitter', name: 'Twitter', validations: [], widgetId: 'singleLine' },
  { id: 'github', name: 'Github', validations: [], widgetId: 'singleLine' },
  {
    id: 'googleScholar',
    name: 'Google Scholar',
    validations: [],
    widgetId: 'singleLine',
  },
  {
    id: 'researchGate',
    name: 'Research Gate',
    validations: [],
    widgetId: 'singleLine',
  },
  { id: 'blueSky', name: 'BlueSky', validations: [], widgetId: 'singleLine' },
];

module.exports.description = 'Create socials content type';

module.exports.up = (migration) => {
  const socials = migration
    .createContentType('socials')
    .name('Socials')
    .description('Social and web profile links belonging to a user');

  SOCIAL_FIELDS.forEach(({ id, name, validations, widgetId }) => {
    socials
      .createField(id)
      .name(name)
      .type('Symbol')
      .localized(false)
      .required(false)
      .validations(validations)
      .disabled(false)
      .omitted(false);

    socials.changeFieldControl(id, 'builtin', widgetId, {});
  });

  socials.displayField('linkedIn');

  // Temporary: dropped once users.userSocials is populated from it.
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

module.exports.down = (migration) => {
  migration.deleteContentType('socials');
};
