module.exports.description = 'Create users content model';

module.exports.up = function (migration) {
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
    .createField('degree')
    .name('Degree')
    .type('Array')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false)
    .items({
      type: 'Symbol',

      validations: [
        {
          in: [
            'AA',
            'AAS',
            'BA',
            'BSc',
            'MA',
            'MBA',
            'MBBS',
            'MD',
            'MD_PhD',
            'MPH',
            'MSc',
            'PhD',
            'PharmD',
          ],
        },
      ],
    });

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
    .createField('region')
    .name('Region')
    .type('Symbol')
    .localized(false)
    .required(false)
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
          pattern: '^\\w[\\w.\\-+]*@([\\w-]+\\.)+[\\w-]+$',
          flags: null,
        },
      },
    ])
    .disabled(false)
    .omitted(false);

  users
    .createField('alternativeEmail')
    .name('Alternative Email')
    .type('Symbol')
    .localized(false)
    .required(false)
    .validations([
      {
        regexp: {
          pattern: '^\\w[\\w.\\-+]*@([\\w-]+\\.)+[\\w-]+$',
          flags: null,
        },
      },
    ])
    .disabled(false)
    .omitted(false);

  users
    .createField('telephoneCountryCode')
    .name('Country Code')
    .type('Symbol')
    .localized(false)
    .required(false)
    .validations([
      {
        regexp: {
          pattern: '^\\+*[1-9]{0,3}$',
          flags: null,
        },
      },
    ])
    .disabled(false)
    .omitted(false);

  users
    .createField('telephoneNumber')
    .name('Telephone Number')
    .type('Symbol')
    .localized(false)
    .required(false)
    .validations([
      {
        regexp: {
          pattern: '^\\(?\\d{3}\\)?[\\s.-]?\\d{3}[\\s.-]?\\d{3,4}$',
          flags: null,
        },
      },
    ])
    .disabled(false)
    .omitted(false);

  users
    .createField('keywords')
    .name('Keywords')
    .type('Array')
    .localized(false)
    .required(false)
    .validations([
      {
        size: {
          min: 1,
          max: 10,
        },
      },
    ])
    .disabled(false)
    .omitted(false)
    .items({
      type: 'Symbol',

      validations: [
        {
          in: [
            'Administrative Support',
            'Bash',
            'Biobanking',
            'Biostatistics',
            'Career Development',
            'Communications',
            'Computer Science',
            'Course Management',
            'Data Science',
            'Diversity',
            'Education',
            'Epidemiology',
            'Genetics',
            'Genomics',
            'GP2 Opportunities',
            'GP2 PhD',
            'Laboratory Science',
            'Machine Learning',
            'Molecular Biology',
            'Movement Disorders',
            'Neurodegeneration',
            'Neurogenetics',
            'Neuroimaging',
            'Neurology',
            'Operations',
            'Outreach',
            'Parkinson disease',
            'Patient Advocate',
            'Patient Engagement',
            'Pharmacogenomics',
            'Program Management',
            'Project Management',
            'Python',
            'R',
            'Research Communications',
            'Research Grants',
            'Stata',
            'Training',
            "GP2 Master's",
          ],
        },
      ],
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
    .createField('fundingStreams')
    .name('Funding Streams')
    .type('Text')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);

  users
    .createField('contributingCohorts')
    .name('Contributing Cohorts')
    .type('Array')
    .localized(false)
    .required(false)
    .validations([
      {
        size: {
          min: 0,
          max: 10,
        },
      },
    ])
    .disabled(false)
    .omitted(false)
    .items({
      type: 'Link',

      validations: [
        {
          linkContentType: ['contributingCohortsMembership'],
        },
      ],

      linkType: 'Entry',
    });

  users
    .createField('blog')
    .name('Blog')
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
    .createField('researchGate')
    .name('Research Gate')
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
    .createField('activatedDate')
    .name('Activated Date')
    .type('Date')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(true)
    .omitted(false);
  users.changeFieldControl('firstName', 'builtin', 'singleLine', {});
  users.changeFieldControl('lastName', 'builtin', 'singleLine', {});
  users.changeFieldControl('avatar', 'builtin', 'assetLinkEditor', {});
  users.changeFieldControl('degree', 'builtin', 'checkbox', {});
  users.changeFieldControl('country', 'builtin', 'singleLine', {});
  users.changeFieldControl('city', 'builtin', 'singleLine', {});
  users.changeFieldControl('region', 'builtin', 'singleLine', {});
  users.changeFieldControl('email', 'builtin', 'singleLine', {});
  users.changeFieldControl('alternativeEmail', 'builtin', 'singleLine', {});
  users.changeFieldControl('telephoneCountryCode', 'builtin', 'singleLine', {});
  users.changeFieldControl('telephoneNumber', 'builtin', 'singleLine', {});
  users.changeFieldControl('keywords', 'builtin', 'checkbox', {});
  users.changeFieldControl('biography', 'builtin', 'multipleLine', {});
  users.changeFieldControl('questions', 'builtin', 'tagEditor', {});
  users.changeFieldControl('fundingStreams', 'builtin', 'multipleLine', {});

  users.changeFieldControl(
    'contributingCohorts',
    'builtin',
    'entryLinksEditor',
    {
      bulkEditing: false,
      showLinkEntityAction: false,
      showCreateEntityAction: true,
    },
  );

  users.changeFieldControl('blog', 'builtin', 'urlEditor', {});
  users.changeFieldControl('linkedIn', 'builtin', 'singleLine', {});
  users.changeFieldControl('twitter', 'builtin', 'singleLine', {});
  users.changeFieldControl('github', 'builtin', 'singleLine', {});
  users.changeFieldControl('googleScholar', 'builtin', 'singleLine', {});
  users.changeFieldControl('orcid', 'builtin', 'singleLine', {});
  users.changeFieldControl('researchGate', 'builtin', 'singleLine', {});
  users.changeFieldControl('researcherId', 'builtin', 'singleLine', {});
  users.changeFieldControl('connections', 'builtin', 'tagEditor', {});

  users.changeFieldControl('role', 'builtin', 'dropdown', {
    helpText: 'Role on the GP2 Hub',
  });

  users.changeFieldControl('onboarded', 'builtin', 'boolean', {});
  users.changeFieldControl('activatedDate', 'builtin', 'datePicker', {});
};

module.exports.down = (migration) => {
  migration.deleteContentType('users');
};
