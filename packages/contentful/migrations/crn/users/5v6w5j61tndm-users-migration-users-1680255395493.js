module.exports.description = 'Create users content model';

module.exports.up = function (migration) {
  const teamMembership = migration
    .createContentType('teamMembership')
    .name('TeamMembership')
    .description('')
    .displayField('role');

  teamMembership
    .createField('team')
    .name('Team')
    .type('Link')
    .localized(false)
    .required(true)
    .validations([
      {
        linkContentType: ['teams'],
      },
    ])
    .disabled(false)
    .omitted(false)
    .linkType('Entry');

  teamMembership
    .createField('role')
    .name('Role')
    .type('Symbol')
    .localized(false)
    .required(true)
    .validations([
      {
        in: [
          'Lead PI (Core Leadership)',
          'Co-PI (Core Leadership)',
          'Project Manager',
          'Collaborating PI',
          'Key Personnel',
          'ASAP Staff',
          'Scientific Advisory Board',
        ],
      },
    ])
    .disabled(false)
    .omitted(false);

  teamMembership
    .createField('inactiveSinceDate')
    .name('Inactive Since')
    .type('Date')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);

  teamMembership.changeFieldControl('team', 'builtin', 'entryLinkEditor', {
    showLinkEntityAction: true,
    showCreateEntityAction: false,
  });

  teamMembership.changeFieldControl('role', 'builtin', 'dropdown', {});
  teamMembership.changeFieldControl(
    'inactiveSinceDate',
    'builtin',
    'datePicker',
    {},
  );

  const users = migration
    .createContentType('users')
    .name('Users')
    .description('')
    .displayField('email');
  users
    .createField('firstName')
    .name('First Name')
    .type('Symbol')
    .localized(false)
    .required(true)
    .validations([])
    .disabled(false)
    .omitted(false);
  users
    .createField('lastName')
    .name('Last Name')
    .type('Symbol')
    .localized(false)
    .required(true)
    .validations([])
    .disabled(false)
    .omitted(false);

  users
    .createField('email')
    .name('Email')
    .type('Symbol')
    .localized(false)
    .required(true)
    .validations([
      {
        regexp: {
          pattern: '^\\w[\\w.-+]*@([\\w-]+\\.)+[\\w-]+$',
          flags: null,
        },
      },
    ])
    .disabled(false)
    .omitted(false);

  users
    .createField('orcid')
    .name('ORCID')
    .type('Symbol')
    .localized(false)
    .required(false)
    .validations([
      {
        unique: true,
      },
      {
        regexp: {
          pattern: '^\\d{4}-\\d{4}-\\d{4}-\\d{3}(\\d|X)$',
          flags: null,
        },

        message: 'ORCID must have the following format: 0000-0000-0000-0000',
      },
    ])
    .disabled(false)
    .omitted(false);

  users
    .createField('degree')
    .name('Degree')
    .type('Symbol')
    .localized(false)
    .required(false)
    .validations([
      {
        in: ['BA', 'BSc', 'MD', 'MD, PhD', 'PhD', 'MPH', 'MSc', 'MA', 'MBA'],
      },
    ])
    .disabled(false)
    .omitted(false);

  users
    .createField('country')
    .name('Country')
    .type('Symbol')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);
  users
    .createField('city')
    .name('City')
    .type('Symbol')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);
  users
    .createField('jobTitle')
    .name('Job Title')
    .type('Symbol')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);
  users
    .createField('institution')
    .name('Institution')
    .type('Symbol')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);

  users
    .createField('contactEmail')
    .name('Correspondence Email')
    .type('Symbol')
    .localized(false)
    .required(false)
    .validations([
      {
        regexp: {
          pattern: '^\\w[\\w.-+]*@([\\w-]+\\.)+[\\w-]+$',
          flags: null,
        },
      },
    ])
    .disabled(false)
    .omitted(false);

  users
    .createField('avatar')
    .name('Avatar')
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

  users
    .createField('website1')
    .name('Website 1')
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

  users
    .createField('website2')
    .name('Website 2')
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

  users
    .createField('linkedIn')
    .name('LinkedIn')
    .type('Symbol')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);
  users
    .createField('researcherId')
    .name('Researcher ID')
    .type('Symbol')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);
  users
    .createField('twitter')
    .name('Twitter')
    .type('Symbol')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);
  users
    .createField('github')
    .name('Github')
    .type('Symbol')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);
  users
    .createField('googleScholar')
    .name('Google Scholar')
    .type('Symbol')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);
  users
    .createField('researchGate')
    .name('Research Gate')
    .type('Symbol')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);
  users
    .createField('responsibilities')
    .name('Responsibilities')
    .type('Text')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);
  users
    .createField('researchInterests')
    .name('Research Interests')
    .type('Text')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);
  users
    .createField('reachOut')
    .name('Reach Out')
    .type('Text')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);
  users
    .createField('expertiseAndResourceDescription')
    .name('Expertise and Resources Description')
    .type('Text')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);

  users
    .createField('expertiseAndResourceTags')
    .name('Expertise and Resources')
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

  users
    .createField('questions')
    .name('Open Questions')
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

  users
    .createField('biography')
    .name('Biography')
    .type('Text')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);
  users
    .createField('adminNotes')
    .name('Admin Notes')
    .type('Text')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);

  users
    .createField('onboarded')
    .name('Onboarding complete')
    .type('Boolean')
    .localized(false)
    .required(false)
    .validations([])
    .defaultValue({
      'en-US': false,
    })
    .disabled(false)
    .omitted(false);

  users
    .createField('dismissedGettingStarted')
    .name('Dismissed Getting Started dialog')
    .type('Boolean')
    .localized(false)
    .required(false)
    .validations([])
    .defaultValue({
      'en-US': false,
    })
    .disabled(false)
    .omitted(false);

  users
    .createField('connections')
    .name('Connections')
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

  users
    .createField('role')
    .name('ASAP Hub Role')
    .type('Symbol')
    .localized(false)
    .required(true)
    .validations([
      {
        in: ['Staff', 'Grantee', 'Guest', 'Hidden'],
      },
    ])
    .disabled(false)
    .omitted(false);

  users
    .createField('orcidLastSyncDate')
    .name('ORCID Last Sync Date')
    .type('Date')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);
  users
    .createField('orcidLastModifiedDate')
    .name('ORCID Last Modified Date')
    .type('Date')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);
  users
    .createField('alumniSinceDate')
    .name('Alumni Since Date')
    .type('Date')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);
  users
    .createField('alumniLocation')
    .name('Alumni New Location')
    .type('Symbol')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);

  users
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
          linkContentType: ['teamMembership'],
        },
      ],

      linkType: 'Entry',
    });

  users
    .createField('labs')
    .name('Labs')
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
          linkContentType: ['labs'],
        },
      ],

      linkType: 'Entry',
    });

  users.changeFieldControl('firstName', 'builtin', 'singleLine', {});
  users.changeFieldControl('lastName', 'builtin', 'singleLine', {});
  users.changeFieldControl('email', 'builtin', 'singleLine', {});

  users.changeFieldControl('orcid', 'builtin', 'singleLine', {
    helpText:
      'Mandatory for grantees. They cannot publish profile without an ORCID. ORCIDs cannot be repeated on the Hub.',
  });

  users.changeFieldControl('degree', 'builtin', 'dropdown', {});
  users.changeFieldControl('country', 'builtin', 'singleLine', {});
  users.changeFieldControl('city', 'builtin', 'singleLine', {});
  users.changeFieldControl('jobTitle', 'builtin', 'singleLine', {});
  users.changeFieldControl('institution', 'builtin', 'singleLine', {});
  users.changeFieldControl('contactEmail', 'builtin', 'singleLine', {});
  users.changeFieldControl('avatar', 'builtin', 'assetLinkEditor', {});
  users.changeFieldControl('website1', 'builtin', 'urlEditor', {});
  users.changeFieldControl('website2', 'builtin', 'urlEditor', {});
  users.changeFieldControl('linkedIn', 'builtin', 'singleLine', {});
  users.changeFieldControl('researcherId', 'builtin', 'singleLine', {});
  users.changeFieldControl('twitter', 'builtin', 'singleLine', {});
  users.changeFieldControl('github', 'builtin', 'singleLine', {});
  users.changeFieldControl('googleScholar', 'builtin', 'singleLine', {});
  users.changeFieldControl('researchGate', 'builtin', 'singleLine', {});
  users.changeFieldControl('responsibilities', 'builtin', 'multipleLine', {});
  users.changeFieldControl('researchInterests', 'builtin', 'multipleLine', {});

  users.changeFieldControl('reachOut', 'builtin', 'multipleLine', {
    helpText: 'Reach out reasons (only relevant for \\"Staff\\" users)',
  });

  users.changeFieldControl(
    'expertiseAndResourceDescription',
    'builtin',
    'multipleLine',
    {},
  );
  users.changeFieldControl(
    'expertiseAndResourceTags',
    'builtin',
    'tagEditor',
    {},
  );
  users.changeFieldControl('questions', 'builtin', 'tagEditor', {});
  users.changeFieldControl('biography', 'builtin', 'multipleLine', {});
  users.changeFieldControl('adminNotes', 'builtin', 'multipleLine', {});
  users.changeFieldControl('onboarded', 'builtin', 'boolean', {});
  users.changeFieldControl('dismissedGettingStarted', 'builtin', 'boolean', {
    helpText: 'Use this to hide the Getting Started component on the home page',
  });
  users.changeFieldControl('connections', 'builtin', 'tagEditor', {});
  users.changeFieldControl('role', 'builtin', 'dropdown', {
    helpText: 'Role on the ASAP Hub',
  });
  users.changeFieldControl('orcidLastSyncDate', 'builtin', 'datePicker', {});
  users.changeFieldControl(
    'orcidLastModifiedDate',
    'builtin',
    'datePicker',
    {},
  );
  users.changeFieldControl('alumniSinceDate', 'builtin', 'datePicker', {});
  users.changeFieldControl('alumniLocation', 'builtin', 'singleLine', {});

  users.changeFieldControl('teams', 'builtin', 'entryCardsEditor', {
    bulkEditing: false,
    showLinkEntityAction: false,
    showCreateEntityAction: true,
  });

  users.changeFieldControl('labs', 'builtin', 'entryLinksEditor', {});
};

module.exports.down = (migration) => {
  migration.deleteContentType('users');
  migration.deleteContentType('teamMembership');
};
