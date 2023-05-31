module.exports.description =
  'Create working groups, wg members, wg leaders and wg deliverables content model';

module.exports.up = function (migration) {
  const workingGroups = migration
    .createContentType('workingGroups')
    .name('Working Groups')
    .description('')
    .displayField('title');
  workingGroups
    .createField('title')
    .name('Title')
    .type('Symbol')
    .localized(false)
    .required(true)
    .validations([])
    .disabled(false)
    .omitted(false);
  workingGroups
    .createField('complete')
    .name('This working group is complete')
    .type('Boolean')
    .localized(false)
    .required(true)
    .validations([])
    .disabled(false)
    .omitted(false);

  workingGroups
    .createField('description')
    .name('Description')
    .type('RichText')
    .localized(false)
    .required(false)
    .validations([
      {
        enabledMarks: [
          'bold',
          'italic',
          'underline',
          'code',
          'superscript',
          'subscript',
        ],
        message:
          'Only bold, italic, underline, code, superscript, and subscript marks are allowed',
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
          'embedded-asset-block',
          'table',
          'hyperlink',
          'embedded-entry-inline',
        ],

        message:
          'Only heading 1, heading 2, heading 3, heading 4, heading 5, heading 6, ordered list, unordered list, horizontal rule, quote, asset, table, link to Url, and inline entry nodes are allowed',
      },
      {
        nodes: {
          'embedded-asset-block': [
            {
              size: {
                min: null,
                max: 10,
              },

              message: null,
            },
          ],

          'embedded-entry-inline': [
            {
              size: {
                min: null,
                max: 10,
              },

              message: null,
            },
          ],
        },
      },
    ])
    .disabled(false)
    .omitted(false);

  workingGroups
    .createField('shortText')
    .name('Short Text')
    .type('Text')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);

  workingGroups
    .createField('calendars')
    .name('Calendars')
    .type('Link')
    .localized(false)
    .required(false)
    .validations([
      {
        linkContentType: ['calendars'],
      },
    ])
    .disabled(false)
    .omitted(false)
    .linkType('Entry');

  workingGroups
    .createField('externalLink')
    .name('External Link')
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

        message: 'URL must start with http:// or https://',
      },
    ])
    .disabled(false)
    .omitted(false);

  workingGroups
    .createField('deliverables')
    .name('Deliverables')
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
          linkContentType: ['workingGroupDeliverables'],
        },
      ],

      linkType: 'Entry',
    });

  workingGroups
    .createField('members')
    .name('Members')
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
          linkContentType: ['workingGroupLeaders', 'workingGroupMembers'],
        },
      ],

      linkType: 'Entry',
    });

  workingGroups.changeFieldControl('title', 'builtin', 'singleLine', {});
  workingGroups.changeFieldControl('complete', 'builtin', 'boolean', {});
  workingGroups.changeFieldControl(
    'description',
    'builtin',
    'richTextEditor',
    {},
  );
  workingGroups.changeFieldControl('shortText', 'builtin', 'multipleLine', {});
  workingGroups.changeFieldControl(
    'calendars',
    'builtin',
    'entryLinkEditor',
    {},
  );
  workingGroups.changeFieldControl('externalLink', 'builtin', 'singleLine', {});
  workingGroups.changeFieldControl(
    'deliverables',
    'builtin',
    'entryLinksEditor',
    {},
  );

  workingGroups.changeFieldControl('members', 'builtin', 'entryLinksEditor', {
    bulkEditing: false,
    showLinkEntityAction: true,
    showCreateEntityAction: true,
  });

  const workingGroupLeaders = migration
    .createContentType('workingGroupLeaders')
    .name('Working Group Leaders')
    .description('')
    .displayField('role');

  workingGroupLeaders
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

  workingGroupLeaders
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

  workingGroupLeaders
    .createField('workstreamRole')
    .name('Workstream Role')
    .type('Symbol')
    .localized(false)
    .required(true)
    .validations([])
    .disabled(false)
    .omitted(false);
  workingGroupLeaders
    .createField('inactiveSinceDate')
    .name('Inactive Since')
    .type('Date')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);

  workingGroupLeaders.changeFieldControl('user', 'builtin', 'entryLinkEditor', {
    showLinkEntityAction: true,
    showCreateEntityAction: false,
  });

  workingGroupLeaders.changeFieldControl('role', 'builtin', 'dropdown', {});
  workingGroupLeaders.changeFieldControl(
    'workstreamRole',
    'builtin',
    'singleLine',
    {},
  );
  workingGroupLeaders.changeFieldControl(
    'inactiveSinceDate',
    'builtin',
    'datePicker',
    {},
  );
  const workingGroupDeliverables = migration
    .createContentType('workingGroupDeliverables')
    .name('Working Group Deliverables')
    .description('')
    .displayField('description');
  workingGroupDeliverables
    .createField('description')
    .name('Description')
    .type('Text')
    .localized(false)
    .required(true)
    .validations([])
    .disabled(false)
    .omitted(false);

  workingGroupDeliverables
    .createField('status')
    .name('Status')
    .type('Symbol')
    .localized(false)
    .required(true)
    .validations([
      {
        in: ['Complete', 'In Progress', 'Pending', 'Incomplete', 'Not Started'],
      },
    ])
    .disabled(false)
    .omitted(false);

  workingGroupDeliverables.changeFieldControl(
    'description',
    'builtin',
    'multipleLine',
    {},
  );
  workingGroupDeliverables.changeFieldControl(
    'status',
    'builtin',
    'dropdown',
    {},
  );
  const workingGroupMembers = migration
    .createContentType('workingGroupMembers')
    .name('Working Group Members')
    .description('');

  workingGroupMembers
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

  workingGroupMembers
    .createField('inactiveSinceDate')
    .name('Inactive Since')
    .type('Date')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);

  workingGroupMembers.changeFieldControl('user', 'builtin', 'entryLinkEditor', {
    showLinkEntityAction: true,
    showCreateEntityAction: false,
  });

  workingGroupMembers.changeFieldControl(
    'inactiveSinceDate',
    'builtin',
    'datePicker',
    {},
  );
};

module.exports.down = (migration) => {
  migration.deleteContentType('workingGroups');
  migration.deleteContentType('workingGroupMembers');
  migration.deleteContentType('workingGroupLeaders');
  migration.deleteContentType('workingGroupDeliverables');
};
