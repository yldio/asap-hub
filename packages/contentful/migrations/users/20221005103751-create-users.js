module.exports.description = 'Create content model for Users';

module.exports.up = (migration) => {
  const users = migration
    .createContentType('users')
    .name('Users')
    .displayField('id')
    .description('');

  users.createField('id').name('ID').type('Symbol');

  users
    .createField('separatorBasicData')
    .name('Basic Data')
    .type('RichText')
    .validations([
      {
        enabledMarks: ['bold', 'italic', 'underline', 'code'],
        message: 'Only bold, italic, underline, and code marks are allowed',
      },
      {
        enabledNodeTypes: [
          'heading-1',
          'heading-2',
          'heading-3',
          'heading-4',
          'heading-5',
          'heading-6',
          'ordered-list',
          'unordered-list',
          'hr',
          'blockquote',
          'embedded-entry-block',
          'embedded-asset-block',
          'hyperlink',
          'entry-hyperlink',
          'asset-hyperlink',
          'embedded-entry-inline',
        ],
        message:
          'Only heading 1, heading 2, heading 3, heading 4, heading 5, heading 6, ordered list, unordered list, horizontal rule, quote, block entry, asset, link to Url, link to entry, link to asset, and inline entry nodes are allowed',
      },
      { nodes: {} },
    ]);

  users.createField('firstName').name('First Name').type('Symbol');

  users.createField('lastName').name('Last Name').type('Symbol');

  users.createField('email').name('Email').type('Symbol');

  users.createField('type').name('Some type').type('Symbol');

  users.createField('orcid').name('ORCID').type('Symbol');

  users
    .createField('teams')
    .name('Teams')
    .type('Array')
    .items({
      type: 'Link',
      validations: [{ linkContentType: ['teams'] }],
      linkType: 'Entry',
    });

  users
    .createField('labs')
    .name('Labs')
    .type('Array')
    .items({
      type: 'Link',
      validations: [{ linkContentType: ['labs'] }],
      linkType: 'Entry',
    });

  users
    .createField('userTeam')
    .name('UserTeam')
    .type('Link')
    .validations([{ linkContentType: ['userTeam'] }])
    .linkType('Entry');

  users.changeFieldControl('id', 'builtin', 'singleLine');
  users.changeFieldControl('separatorBasicData', 'builtin', 'richTextEditor');
  users.changeFieldControl('firstName', 'builtin', 'singleLine');
  users.changeFieldControl('lastName', 'builtin', 'singleLine');
  users.changeFieldControl('email', 'builtin', 'singleLine');
  users.changeFieldControl('orcid', 'builtin', 'singleLine');
  users.changeFieldControl('teams', 'builtin', 'entryLinksEditor');
  users.changeFieldControl('labs', 'builtin', 'entryLinksEditor');
  users.changeFieldControl('userTeam', 'builtin', 'entryLinkEditor');
};

module.exports.down = (migration) => migration.deleteContentType('users');
