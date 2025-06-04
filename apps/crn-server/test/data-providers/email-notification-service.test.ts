import { FetchManuscriptNotificationDetailsQuery } from '@asap-hub/contentful';
import { EmailNotificationService } from '../../src/data-providers/email-notification-service';

import logger from '../../src/utils/logger';
import { getContentfulGraphqlManuscript } from '../fixtures/manuscript.fixtures';
import { getContentfulGraphqlClientMock } from '../mocks/contentful-graphql-client.mock';

jest.mock('@asap-hub/contentful', () => ({
  ...jest.requireActual('@asap-hub/contentful'),
  patch: jest.fn().mockResolvedValue(undefined),
  pollContentfulGql: jest
    .fn()
    .mockImplementation(async (_version, fetchData, _entity) => {
      await fetchData();
      return Promise.resolve();
    }),
}));
const mockedPostmark = jest.fn();
jest.mock('postmark', () => ({
  ServerClient: jest.fn().mockImplementation(() => ({
    sendEmailWithTemplate: mockedPostmark,
  })),
}));

const mockEnvironmentGetter = jest.fn();
jest.mock('../../src/config', () => ({
  ...jest.requireActual('../../src/config'),
  get environment() {
    return mockEnvironmentGetter();
  },
}));

describe('Email Notification Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });
  const contentfulGraphqlClientMock = getContentfulGraphqlClientMock();
  const emailNotificationService = new EmailNotificationService(
    contentfulGraphqlClientMock,
  );
  const assignedUsers = {
    items: [
      {
        firstName: 'John',
        lastName: 'Doe',
      },
      {
        firstName: 'Jane',
        lastName: 'Doe',
      },
    ],
  };
  const manuscript = getContentfulGraphqlManuscript() as NonNullable<
    NonNullable<FetchManuscriptNotificationDetailsQuery>['manuscripts']
  >;
  manuscript.assignedUsersCollection = assignedUsers;
  manuscript.versionsCollection!.items[0]!.firstAuthorsCollection!.items = [
    {
      __typename: 'Users',
      email: 'fiona.first@email.com',
    },
  ];

  manuscript.versionsCollection!.items[0]!.correspondingAuthorCollection!.items =
    [
      {
        __typename: 'Users',
        email: 'connor.corresponding@email.com',
      },
    ];

  manuscript.versionsCollection!.items[0]!.additionalAuthorsCollection!.items =
    [
      {
        __typename: 'ExternalAuthors',
        email: 'second.external@email.com',
      },
    ];

  test('Should not send email notification if environment is not production and no notification list', async () => {
    mockEnvironmentGetter.mockReturnValueOnce('development');
    contentfulGraphqlClientMock.request.mockResolvedValue({
      manuscripts: manuscript,
    });

    await emailNotificationService.sendEmailNotification(
      'manuscript_submitted',
      manuscript.sys.id,
      '',
    );

    expect(mockedPostmark).not.toHaveBeenCalled();
  });

  test('Should not send email notification if manuscript not returned', async () => {
    mockEnvironmentGetter.mockReturnValueOnce('production');
    contentfulGraphqlClientMock.request.mockResolvedValue({
      manuscripts: null,
    });

    await emailNotificationService.sendEmailNotification(
      'manuscript_submitted',
      manuscript.sys.id,
      '',
    );

    expect(mockedPostmark).not.toHaveBeenCalled();
  });

  describe('Email Notification Recipients Handling', () => {
    beforeEach(() => {
      mockedPostmark.mockResolvedValue({
        ErrorCode: 0,
        Message: 'OK',
      });
    });

    test.each`
      template                    | action
      ${'manuscript_submitted'}   | ${'submitted'}
      ${'manuscript_resubmitted'} | ${'resubmitted'}
    `(
      'Should send email notification to OS team when manuscript is $action',
      async ({ template }) => {
        mockEnvironmentGetter.mockReturnValueOnce('production');
        contentfulGraphqlClientMock.request.mockResolvedValue({
          manuscripts: manuscript,
        });

        await emailNotificationService.sendEmailNotification(
          template,
          manuscript.sys.id,
          '',
        );

        expect(mockedPostmark).toHaveBeenCalledTimes(2);
        expect(mockedPostmark).toHaveBeenCalledWith(
          expect.objectContaining({
            To: 'openscience@parkinsonsroadmap.org',
          }),
        );
        expect(mockedPostmark).toHaveBeenCalledWith(
          expect.objectContaining({
            To: 'fiona.first@email.com,second.external@email.com,connor.corresponding@email.com',
          }),
        );
      },
    );

    test.each`
      template                                     | action
      ${'discussion_created'}                      | ${'discussion created'}
      ${'os_member_replied_to_discussion'}         | ${'os member replied to discussion'}
      ${'status_changed_review_compliance_report'} | ${'manuscript status changed to review compliance report'}
      ${'status_changed_submit_final_publication'} | ${'manuscript status changed to submit final publication'}
      ${'status_changed_addendum_required'}        | ${'manuscript status changed to addendum required'}
      ${'status_changed_compliant'}                | ${'manuscript status changed to compliant'}
      ${'status_changed_closed_other'}             | ${'manuscript status changed to closed'}
    `(
      'Should not send email notification to OS team when $action',
      async ({ template }) => {
        mockEnvironmentGetter.mockReturnValueOnce('production');
        contentfulGraphqlClientMock.request.mockResolvedValue({
          manuscripts: manuscript,
        });

        await emailNotificationService.sendEmailNotification(
          template,
          manuscript.sys.id,
          '',
        );

        expect(mockedPostmark).toHaveBeenCalledTimes(1);
        expect(mockedPostmark).toHaveBeenCalledWith(
          expect.not.objectContaining({
            To: 'openscience@parkinsonsroadmap.org',
          }),
        );
      },
    );

    test('filters recipients emails when environment is not production and notification list is provided', async () => {
      mockEnvironmentGetter.mockReturnValueOnce('development');
      contentfulGraphqlClientMock.request.mockResolvedValue({
        manuscripts: manuscript,
      });

      await emailNotificationService.sendEmailNotification(
        'manuscript_submitted',
        manuscript.sys.id,
        'second.external@email.com',
      );

      expect(mockedPostmark).toHaveBeenCalledWith(
        expect.objectContaining({ To: 'second.external@email.com' }),
      );
    });

    test('sends email notification with contributing authors as recipients', async () => {
      mockEnvironmentGetter.mockReturnValueOnce('production');
      const recipients =
        'fiona.first@email.com,second.external@email.com,connor.corresponding@email.com';

      contentfulGraphqlClientMock.request.mockResolvedValue({
        manuscripts: manuscript,
      });

      await emailNotificationService.sendEmailNotification(
        'manuscript_submitted',
        manuscript.sys.id,
        '',
      );

      expect(mockedPostmark).toHaveBeenCalledWith(
        expect.objectContaining({ To: recipients }),
      );
    });

    test('sends email notification with active Project Managers and Lead PIs of contributing teams as recipients', async () => {
      mockEnvironmentGetter.mockReturnValueOnce('production');
      const manuscript = getContentfulGraphqlManuscript() as NonNullable<
        NonNullable<FetchManuscriptNotificationDetailsQuery>['manuscripts']
      >;

      manuscript.versionsCollection!.items[0]!.teamsCollection!.items = [
        {
          sys: {
            id: 'team-1',
          },
          linkedFrom: {
            teamMembershipCollection: {
              items: [
                {
                  role: 'Project Manager',
                  inactiveSinceDate: '2022-01-03T10:00:00.000Z',
                  linkedFrom: {
                    usersCollection: {
                      items: [
                        {
                          alumniSinceDate: null,
                          email: 'inactive.membership@example.com',
                        },
                      ],
                    },
                  },
                },
                {
                  role: 'Project Manager',
                  inactiveSinceDate: null,
                  linkedFrom: {
                    usersCollection: {
                      items: [
                        {
                          alumniSinceDate: '2022-01-03T10:00:00.000Z',
                          email: 'inactive.user@example.com',
                        },
                      ],
                    },
                  },
                },
                {
                  role: 'Project Manager',
                  inactiveSinceDate: null,
                  linkedFrom: {
                    usersCollection: {
                      items: [
                        {
                          alumniSinceDate: null,
                          email: 'active.pm@example.com',
                        },
                      ],
                    },
                  },
                },
              ],
            },
          },
        },
        {
          sys: {
            id: 'team-2',
          },
          linkedFrom: {
            teamMembershipCollection: {
              items: [
                {
                  role: 'Trainee',
                  inactiveSinceDate: null,
                  linkedFrom: {
                    usersCollection: {
                      items: [
                        {
                          alumniSinceDate: null,
                          email: 'trainee@example.com',
                        },
                      ],
                    },
                  },
                },
                {
                  role: 'Lead PI (Core Leadership)',
                  inactiveSinceDate: null,
                  linkedFrom: {
                    usersCollection: {
                      items: [
                        {
                          alumniSinceDate: null,
                          email: 'lead.pi@example.com',
                        },
                      ],
                    },
                  },
                },
              ],
            },
          },
        },
      ];
      manuscript.versionsCollection!.items[0]!.firstAuthorsCollection =
        undefined;
      manuscript.versionsCollection!.items[0]!.additionalAuthorsCollection =
        undefined;
      manuscript.versionsCollection!.items[0]!.correspondingAuthorCollection =
        undefined;

      const recipients = 'active.pm@example.com,lead.pi@example.com';

      contentfulGraphqlClientMock.request.mockResolvedValue({
        manuscripts: manuscript,
      });

      await emailNotificationService.sendEmailNotification(
        'manuscript_submitted',
        manuscript.sys.id,
        '',
      );
      expect(mockedPostmark).toHaveBeenCalledWith(
        expect.objectContaining({ To: recipients }),
      );
    });

    test('sends email notification with correct Open Science team recipients based on environment', async () => {
      const manuscript = getContentfulGraphqlManuscript() as NonNullable<
        NonNullable<FetchManuscriptNotificationDetailsQuery>['manuscripts']
      >;

      mockEnvironmentGetter.mockReturnValueOnce('production');
      contentfulGraphqlClientMock.request.mockResolvedValue({
        manuscripts: manuscript,
      });

      await emailNotificationService.sendEmailNotification(
        'manuscript_submitted',
        manuscript.sys.id,
        '',
      );

      expect(mockedPostmark).toHaveBeenCalledWith(
        expect.objectContaining({
          To: expect.stringContaining('openscience@parkinsonsroadmap.org'),
        }),
      );

      jest.clearAllMocks();

      mockEnvironmentGetter.mockReturnValueOnce('development');
      contentfulGraphqlClientMock.request.mockResolvedValue({
        manuscripts: manuscript,
      });

      await emailNotificationService.sendEmailNotification(
        'manuscript_submitted',
        manuscript.sys.id,
        '',
      );

      expect(mockedPostmark).not.toHaveBeenCalledWith(
        expect.objectContaining({
          To: expect.stringContaining('openscience@parkinsonsroadmap.org'),
        }),
      );
    });

    test('sends email notification with active PIs of contributing labs as recipients', async () => {
      mockEnvironmentGetter.mockReturnValueOnce('production');
      const manuscript = getContentfulGraphqlManuscript() as NonNullable<
        NonNullable<FetchManuscriptNotificationDetailsQuery>['manuscripts']
      >;

      manuscript.versionsCollection!.items[0]!.labsCollection!.items = [
        {
          labPi: {
            alumniSinceDate: '2022-01-03T10:00:00.000Z',
            email: 'inactive.pi@example.com',
          },
        },
        {
          labPi: {
            alumniSinceDate: null,
            email: 'active.pi@example.com',
          },
        },
      ];
      manuscript.versionsCollection!.items[0]!.firstAuthorsCollection =
        undefined;
      manuscript.versionsCollection!.items[0]!.additionalAuthorsCollection =
        undefined;
      manuscript.versionsCollection!.items[0]!.correspondingAuthorCollection =
        undefined;

      const recipients = 'active.pi@example.com';

      contentfulGraphqlClientMock.request.mockResolvedValue({
        manuscripts: manuscript,
      });

      await emailNotificationService.sendEmailNotification(
        'manuscript_submitted',
        manuscript.sys.id,
        '',
      );
      expect(mockedPostmark).toHaveBeenCalledWith(
        expect.objectContaining({ To: recipients }),
      );
    });

    describe('Trigger action os_member_replied_to_discussion', () => {
      test('does not send email if discussion is not returned', async () => {
        mockEnvironmentGetter.mockReturnValueOnce('production');

        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          manuscripts: manuscript,
        });

        contentfulGraphqlClientMock.request.mockResolvedValue({
          discussions: null,
        });

        await emailNotificationService.sendEmailNotification(
          'os_member_replied_to_discussion',
          manuscript.sys.id,
          '',
          'discussion-id',
        );

        expect(mockedPostmark).not.toHaveBeenCalled();
      });

      test('does not send email if discussion recipients are absent from notification list and environment is not production', async () => {
        mockEnvironmentGetter.mockReturnValueOnce('development');

        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          manuscripts: manuscript,
        });

        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          discussions: {
            title: 'Discussion Title',
          },
        });

        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          discussions: {
            message: null,
            repliesCollection: {
              items: [
                {
                  createdBy: {
                    email: 'jane@doe.asap.com',
                  },
                },
              ],
            },
          },
        });

        await emailNotificationService.sendEmailNotification(
          'os_member_replied_to_discussion',
          manuscript.sys.id,
          '',
          'discussion-id',
        );

        expect(mockedPostmark).not.toHaveBeenCalled();
      });

      test('sends email when discussion recipients are in the notification list and environment is not production', async () => {
        mockEnvironmentGetter.mockReturnValueOnce('development');

        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          manuscripts: manuscript,
        });

        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          discussions: {
            title: 'Discussion Title',
          },
        });

        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          discussions: {
            message: {
              createdBy: {
                email: 'jim@doe.asap.com',
              },
            },
            repliesCollection: {
              items: [
                {
                  createdBy: {
                    email: 'jane@doe.asap.com',
                  },
                },
              ],
            },
          },
        });

        await emailNotificationService.sendEmailNotification(
          'os_member_replied_to_discussion',
          manuscript.sys.id,
          'jim@doe.asap.com',
          'discussion-id',
        );

        expect(mockedPostmark).toHaveBeenCalledWith(
          expect.objectContaining({ To: 'jim@doe.asap.com' }),
        );
      });

      test('removes duplicate emails from recipients when discussion recipients are in the notification list and environment is not production', async () => {
        mockEnvironmentGetter.mockReturnValueOnce('development');

        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          manuscripts: manuscript,
        });

        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          discussions: {
            title: 'Discussion Title',
          },
        });

        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          discussions: {
            message: {
              createdBy: {
                email: 'jim@doe.asap.com',
              },
            },
            repliesCollection: {
              items: [
                {
                  createdBy: {
                    email: 'jane@doe.asap.com',
                  },
                },
                {
                  createdBy: {
                    email: 'jim@doe.asap.com',
                  },
                },
              ],
            },
          },
        });

        await emailNotificationService.sendEmailNotification(
          'os_member_replied_to_discussion',
          manuscript.sys.id,
          'jim@doe.asap.com,jane@doe.asap.com',
          'discussion-id',
        );

        expect(mockedPostmark).toHaveBeenCalledWith(
          expect.objectContaining({
            To: 'jim@doe.asap.com,jane@doe.asap.com',
          }),
        );
      });

      test('sends emails to all discussion recipients when environment is production', async () => {
        mockEnvironmentGetter.mockReturnValueOnce('production');

        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          manuscripts: manuscript,
        });

        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          discussions: {
            title: 'Discussion Title',
          },
        });

        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          discussions: {
            message: {
              createdBy: {
                email: 'jim@doe.asap.com',
              },
            },
            repliesCollection: {
              items: [
                {
                  createdBy: {
                    email: 'jane@doe.asap.com',
                  },
                },
                {
                  createdBy: {
                    email: 'jim@doe.asap.com',
                  },
                },
              ],
            },
          },
        });

        await emailNotificationService.sendEmailNotification(
          'os_member_replied_to_discussion',
          manuscript.sys.id,
          '',
          'discussion-id',
        );

        expect(mockedPostmark).toHaveBeenCalledWith(
          expect.objectContaining({
            To: 'jim@doe.asap.com,jane@doe.asap.com',
          }),
        );
      });
    });
  });

  test('Should log when email fails to send', async () => {
    mockEnvironmentGetter.mockReturnValueOnce('production');
    const loggerErrorSpy = jest.spyOn(logger, 'error');
    contentfulGraphqlClientMock.request.mockResolvedValue({
      manuscripts: manuscript,
    });
    mockedPostmark
      .mockResolvedValueOnce({
        ErrorCode: 405,
        Message: 'Not allowed to send',
      })
      .mockResolvedValueOnce({
        ErrorCode: 406,
        Message: 'Inactive recipient',
      });

    await emailNotificationService.sendEmailNotification(
      'manuscript_submitted',
      manuscript.sys.id,
      'second.external@email.com,openscience@parkinsonsroadmap.org',
    );

    expect(loggerErrorSpy).toHaveBeenNthCalledWith(
      1,
      `Error while sending compliance email notification: Not allowed to send`,
    );
    expect(loggerErrorSpy).toHaveBeenNthCalledWith(
      2,
      `Error while sending compliance email notification: Inactive recipient`,
    );
  });

  test('Should log when email fails to send and action is os_member_replied_to_discussion', async () => {
    mockEnvironmentGetter.mockReturnValueOnce('production');
    const loggerErrorSpy = jest.spyOn(logger, 'error');
    contentfulGraphqlClientMock.request.mockResolvedValueOnce({
      manuscripts: manuscript,
    });

    contentfulGraphqlClientMock.request.mockResolvedValueOnce({
      discussions: {
        title: 'Discussion Title',
      },
    });

    contentfulGraphqlClientMock.request.mockResolvedValueOnce({
      discussions: {
        message: null,
        repliesCollection: {
          items: [
            {
              createdBy: {
                email: 'jane@doe.asap.com',
              },
            },
          ],
        },
      },
    });

    mockedPostmark.mockResolvedValueOnce({
      ErrorCode: 405,
      Message: 'Not allowed to send',
    });
    await emailNotificationService.sendEmailNotification(
      'os_member_replied_to_discussion',
      manuscript.sys.id,
      'jane@doe.asap.com',
      'discussion-id',
    );

    expect(loggerErrorSpy).toHaveBeenCalledWith(
      `Error while sending compliance email notification: Not allowed to send`,
    );
  });
});
