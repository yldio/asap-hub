module.exports.description = 'Create interestGroups content model';

module.exports.up = function (migration) {
  const interestGroups = migration
    .createContentType('interestGroups')
    .name('Interest Groups')
    .description('')
    .displayField('name');

  interestGroups
    .createField('name')
    .name('Name')
    .type('Symbol')
    .localized(false)
    .required(true)
    .validations([])
    .disabled(false)
    .omitted(false);

  interestGroups
    .createField('active')
    .name('Active')
    .type('Boolean')
    .localized(false)
    .required(true)
    .validations([])
    .disabled(false)
    .omitted(false);

  interestGroups
    .createField('description')
    .name('Description')
    .type('Text')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);

  interestGroups
    .createField('tags')
    .name('Tags')
    .type('Array')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false)
    .items({
      type: 'Symbol',
      validations: [],
    });

  interestGroups
    .createField('slack')
    .name('Slack')
    .type('Symbol')
    .localized(false)
    .required(false)
    .validations([
      {
        regexp: {
          pattern:
            '^(ftp|http|https):\\/\\/(\\w+:{0,1}\\w*@)?(\\S+)(:[0-9]+)?(\\/|\\/([\\w#!:.?+=&%@!\\-/]))?$',
          flags: null,
        },
      },
    ])
    .disabled(false)
    .omitted(false);

  interestGroups
    .createField('googleDrive')
    .name('Google Drive')
    .type('Symbol')
    .localized(false)
    .required(false)
    .validations([
      {
        regexp: {
          pattern:
            '^(ftp|http|https):\\/\\/(\\w+:{0,1}\\w*@)?(\\S+)(:[0-9]+)?(\\/|\\/([\\w#!:.?+=&%@!\\-/]))?$',
          flags: null,
        },
      },
    ])
    .disabled(false)
    .omitted(false);

  interestGroups
    .createField('thumbnail')
    .name('Thumbnail')
    .type('Link')
    .localized(false)
    .required(false)
    .validations([
      {
        linkMimetypeGroup: ['image'],
      },
    ])
    .disabled(false)
    .omitted(false)
    .linkType('Asset');

  interestGroups
    .createField('calendar')
    .name('Calendar')
    .type('Link')
    .localized(false)
    .required(false)
    .disabled(false)
    .omitted(false)
    .validations([
      {
        linkContentType: ['calendars'],
      },
    ])
    .linkType('Entry');

  interestGroups
    .createField('teams')
    .name('Teams')
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
          linkContentType: ['teams'],
        },
      ],

      linkType: 'Entry',
    });

  interestGroups.changeFieldControl('teams', 'builtin', 'entryCardsEditor', {
    bulkEditing: false,
    showLinkEntityAction: true,
    showCreateEntityAction: false,
  });

  interestGroups.changeFieldControl('calendar', 'builtin', 'entryLinkEditor', {
    showLinkEntityAction: true,
    showCreateEntityAction: false,
  });

  const interestGroupLeaders = migration
    .createContentType('interestGroupLeaders')
    .name('Interest Group Leaders')
    .description('')
    .displayField('user');

  interestGroupLeaders
    .createField('user')
    .name('User')
    .type('Link')
    .localized(false)
    .required(true)
    .validations([
      {
        linkContentType: ['users'],
      },
    ])
    .disabled(false)
    .omitted(false)
    .linkType('Entry');

  interestGroupLeaders
    .createField('role')
    .name('Role')
    .type('Symbol')
    .localized(false)
    .required(true)
    .validations([
      {
        in: ['Project Manager', 'Chair'],
      },
    ])
    .disabled(false)
    .omitted(false);

  interestGroupLeaders
    .createField('inactiveSinceDate')
    .name('Inactive Since')
    .type('Date')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);

  interestGroupLeaders.changeFieldControl(
    'user',
    'builtin',
    'entryLinkEditor',
    {
      showLinkEntityAction: true,
      showCreateEntityAction: false,
    },
  );

  interestGroupLeaders.changeFieldControl('role', 'builtin', 'dropdown', {});
  interestGroupLeaders.changeFieldControl(
    'inactiveSinceDate',
    'builtin',
    'datePicker',
    {},
  );

  interestGroups
    .createField('leaders')
    .name('Leaders')
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
          linkContentType: ['interestGroupLeaders'],
        },
      ],

      linkType: 'Entry',
    });

  interestGroups.changeFieldControl('leaders', 'builtin', 'entryCardsEditor', {
    bulkEditing: false,
    showLinkEntityAction: false,
    showCreateEntityAction: true,
  });

  interestGroups.changeFieldControl(
    'description',
    'builtin',
    'multipleLine',
    {},
  );
};

module.exports.down = (migration) => {
  migration.deleteContentType('interestGroups');
  migration.deleteContentType('interestGroupLeaders');
};
