module.exports.description = 'Create events content model';

module.exports.up = (migration) => {
  const events = migration
    .createContentType('events')
    .name('Events')
    .description('')
    .displayField('title');
  events
    .createField('title')
    .name('Title')
    .type('Symbol')
    .localized(false)
    .required(true)
    .validations([])
    .disabled(false)
    .omitted(false);
  events
    .createField('startDate')
    .name('Start Date')
    .type('Date')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);

  events
    .createField('status')
    .name('Status')
    .type('Symbol')
    .localized(false)
    .required(false)
    .validations([
      {
        in: ['Confirmed', 'Tentative', 'Cancelled'],
      },
    ])
    .disabled(false)
    .omitted(false);

  events
    .createField('calendar')
    .name('Calendar')
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

  events
    .createField('hidden')
    .name('Hide Event')
    .type('Boolean')
    .localized(false)
    .required(true)
    .validations([])
    .disabled(false)
    .omitted(false);

  events
    .createField('meetingLink')
    .name('Meeting Link')
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

  events
    .createField('hideMeetingLink')
    .name('Hide Meeting Link')
    .type('Boolean')
    .localized(false)
    .required(true)
    .validations([])
    .disabled(false)
    .omitted(false);
  events
    .createField('thumbnail')
    .name('Thumbnail')
    .type('Link')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false)
    .linkType('Asset');

  events
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

  events
    .createField('speakers')
    .name('Speakers')
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
          linkContentType: ['eventSpeakers'],
        },
      ],

      linkType: 'Entry',
    });

  events
    .createField('notesPermanentlyUnavailable')
    .name('Mark Notes as permanently unavailable')
    .type('Boolean')
    .localized(false)
    .required(false)
    .validations([])
    .defaultValue({
      'en-US': false,
    })
    .disabled(false)
    .omitted(false);

  events
    .createField('notes')
    .name('Notes')
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
          'embedded-entry-block',
          'embedded-asset-block',
          'table',
          'hyperlink',
          'entry-hyperlink',
          'asset-hyperlink',
          'embedded-entry-inline',
        ],

        message:
          'Only heading 1, heading 2, heading 3, heading 4, heading 5, heading 6, ordered list, unordered list, horizontal rule, quote, block entry, asset, table, link to Url, link to entry, link to asset, and inline entry nodes are allowed',
      },
      {
        nodes: {
          'asset-hyperlink': [
            {
              size: {
                min: null,
                max: 7,
              },

              message: null,
            },
          ],

          'embedded-asset-block': [
            {
              size: {
                min: null,
                max: 8,
              },

              message: null,
            },
          ],

          'embedded-entry-block': [
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
                max: 6,
              },

              message: null,
            },
          ],

          'entry-hyperlink': [
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

  events
    .createField('notesUpdatedAt')
    .name('Notes Updated At')
    .type('Date')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);

  events
    .createField('videoRecordingPermanentlyUnavailable')
    .name('Mark Video Recording as permanently unavailable')
    .type('Boolean')
    .localized(false)
    .required(false)
    .validations([])
    .defaultValue({
      'en-US': false,
    })
    .disabled(false)
    .omitted(false);

  events
    .createField('videoRecording')
    .name('Video Recording')
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
          'embedded-entry-block',
          'embedded-asset-block',
          'table',
          'hyperlink',
          'entry-hyperlink',
          'asset-hyperlink',
          'embedded-entry-inline',
        ],

        message:
          'Only heading 1, heading 2, heading 3, heading 4, heading 5, heading 6, ordered list, unordered list, horizontal rule, quote, block entry, asset, table, link to Url, link to entry, link to asset, and inline entry nodes are allowed',
      },
      {
        nodes: {
          'asset-hyperlink': [
            {
              size: {
                min: null,
                max: 10,
              },

              message: null,
            },
          ],

          'embedded-asset-block': [
            {
              size: {
                min: null,
                max: 10,
              },

              message: null,
            },
          ],

          'embedded-entry-block': [
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

          'entry-hyperlink': [
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

  events
    .createField('videoRecordingUpdatedAt')
    .name('Video Recording Updated At')
    .type('Date')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);

  events
    .createField('presentationPermanentlyUnavailable')
    .name('Mark Presentation as permanently unavailable')
    .type('Boolean')
    .localized(false)
    .required(false)
    .validations([])
    .defaultValue({
      'en-US': false,
    })
    .disabled(false)
    .omitted(false);

  events
    .createField('presentation')
    .name('Presentation')
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
          'embedded-entry-block',
          'embedded-asset-block',
          'table',
          'hyperlink',
          'entry-hyperlink',
          'asset-hyperlink',
          'embedded-entry-inline',
        ],

        message:
          'Only heading 1, heading 2, heading 3, heading 4, heading 5, heading 6, ordered list, unordered list, horizontal rule, quote, block entry, asset, table, link to Url, link to entry, link to asset, and inline entry nodes are allowed',
      },
      {
        nodes: {
          'asset-hyperlink': [
            {
              size: {
                min: null,
                max: 10,
              },

              message: null,
            },
          ],

          'embedded-asset-block': [
            {
              size: {
                min: null,
                max: 10,
              },

              message: null,
            },
          ],

          'embedded-entry-block': [
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

          'entry-hyperlink': [
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

  events
    .createField('presentationUpdatedAt')
    .name('Presentation Updated At')
    .type('Date')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);
  events
    .createField('meetingMaterials')
    .name('Additional Meeting Materials')
    .type('Object')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);

  events
    .createField('meetingMaterialsPermanentlyUnavailable')
    .name('Mark Add. Meeting Materials as perm. unavailable')
    .type('Boolean')
    .localized(false)
    .required(false)
    .validations([])
    .defaultValue({
      'en-US': false,
    })
    .disabled(false)
    .omitted(false);

  events
    .createField('description')
    .name('Description')
    .type('Text')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);
  events
    .createField('startDateTimeZone')
    .name('Start Date Time Zone')
    .type('Symbol')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);
  events
    .createField('endDate')
    .name('End Date')
    .type('Date')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);
  events
    .createField('endDateTimeZone')
    .name('End Date Time Zone')
    .type('Symbol')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);

  events
    .createField('eventLink')
    .name('Google Event Link')
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

  events
    .createField('googleId')
    .name('Google Id')
    .type('Symbol')
    .localized(false)
    .required(true)
    .validations([
      {
        unique: true,
      },
    ])
    .disabled(false)
    .omitted(false);

  events.changeFieldControl('title', 'app', '2finDNk15g5UtOq4DaLNxv', {});
  events.changeFieldControl('startDate', 'app', '2finDNk15g5UtOq4DaLNxv', {});
  events.changeFieldControl('status', 'app', '2finDNk15g5UtOq4DaLNxv', {});

  events.changeFieldControl('calendar', 'builtin', 'entryLinkEditor', {
    showLinkEntityAction: true,
    showCreateEntityAction: false,
  });

  events.changeFieldControl('hidden', 'builtin', 'boolean', {
    helpText:
      'Hidden events will NOT show on the Hub. (Note: any event cancelled on GCal will be hidden by default. To show a cancelled event on the Hub, you have to manually un-hide the event here)',
    trueLabel: 'Yes',
    falseLabel: 'No',
  });

  events.changeFieldControl('meetingLink', 'builtin', 'urlEditor', {});
  events.changeFieldControl('hideMeetingLink', 'builtin', 'boolean', {});
  events.changeFieldControl('thumbnail', 'builtin', 'assetLinkEditor', {});
  events.changeFieldControl('tags', 'builtin', 'tagEditor', {});
  events.changeFieldControl('speakers', 'builtin', 'entryLinksEditor', {});

  events.changeFieldControl(
    'notesPermanentlyUnavailable',
    'builtin',
    'boolean',
    {
      helpText:
        "This box is automatically ticked if no output is added after 14 days from the event's end date.",
      trueLabel: 'Yes',
      falseLabel: 'No',
    },
  );

  events.changeFieldControl('notes', 'builtin', 'richTextEditor', {
    helpText:
      'If permanently unavailable box is ticked, any content you put here will be ignored.',
  });

  events.changeFieldControl('notesUpdatedAt', 'app', 'mqvX9KU5AthRTlnIRhNNh', {
    observedField: 'notes',
  });

  events.changeFieldControl(
    'videoRecordingPermanentlyUnavailable',
    'builtin',
    'boolean',
    {
      helpText:
        "This box is automatically ticked if no output is added after 14 days from the event's end date.",
      trueLabel: 'Yes',
      falseLabel: 'No',
    },
  );

  events.changeFieldControl('videoRecording', 'builtin', 'richTextEditor', {
    helpText:
      'If permanently unavailable box is ticked, any content you put here will be ignored.',
  });

  events.changeFieldControl(
    'videoRecordingUpdatedAt',
    'app',
    'mqvX9KU5AthRTlnIRhNNh',
    {
      observedField: 'videoRecording',
    },
  );

  events.changeFieldControl(
    'presentationPermanentlyUnavailable',
    'builtin',
    'boolean',
    {},
  );

  events.changeFieldControl('presentation', 'builtin', 'richTextEditor', {
    helpText:
      'If permanently unavailable box is ticked, any content you put here will be ignored.',
  });

  events.changeFieldControl(
    'presentationUpdatedAt',
    'app',
    'mqvX9KU5AthRTlnIRhNNh',
    {
      observedField: 'presentation',
    },
  );

  events.changeFieldControl(
    'meetingMaterials',
    'app',
    '3TfrYX8zVOgFtKxro89UVA',
    {
      key1: 'title',
      key2: 'url',
      helpText:
        'If permanently unavailable box is ticked, any content you put here will be ignored.',
    },
  );

  events.changeFieldControl(
    'meetingMaterialsPermanentlyUnavailable',
    'builtin',
    'boolean',
    {
      helpText:
        "This box is automatically ticked if no output is added after 14 days from the event's end date.",
      trueLabel: 'Yes',
      falseLabel: 'No',
    },
  );

  events.changeFieldControl('description', 'app', '2finDNk15g5UtOq4DaLNxv', {});
  events.changeFieldControl(
    'startDateTimeZone',
    'app',
    '2finDNk15g5UtOq4DaLNxv',
    {},
  );
  events.changeFieldControl('endDate', 'app', '2finDNk15g5UtOq4DaLNxv', {});
  events.changeFieldControl(
    'endDateTimeZone',
    'app',
    '2finDNk15g5UtOq4DaLNxv',
    {},
  );
  events.changeFieldControl('eventLink', 'app', '2finDNk15g5UtOq4DaLNxv', {});
  events.changeFieldControl('googleId', 'app', '2finDNk15g5UtOq4DaLNxv', {});

  const eventSpeakers = migration
    .createContentType('eventSpeakers')
    .name('Event Speakers')
    .description('')
    .displayField('title');
  eventSpeakers
    .createField('title')
    .name('Title')
    .type('Symbol')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);

  eventSpeakers
    .createField('team')
    .name('Team')
    .type('Link')
    .localized(false)
    .required(false)
    .validations([
      {
        linkContentType: ['teams'],
      },
    ])
    .disabled(false)
    .omitted(false)
    .linkType('Entry');

  eventSpeakers
    .createField('user')
    .name('User')
    .type('Link')
    .localized(false)
    .required(false)
    .validations([
      {
        linkContentType: ['externalAuthors'],
      },
    ])
    .disabled(false)
    .omitted(false)
    .linkType('Entry');

  eventSpeakers.changeFieldControl(
    'title',
    'app',
    '6ZkXISzhv1b7jjgyaK2piv',
    {},
  );
  eventSpeakers.changeFieldControl('team', 'builtin', 'entryLinkEditor', {});
  eventSpeakers.changeFieldControl('user', 'builtin', 'entryLinkEditor', {});
};

module.exports.down = (migration) => {
  migration.deleteContentType('events');
  migration.deleteContentType('events');
};
