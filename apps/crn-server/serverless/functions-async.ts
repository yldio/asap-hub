import { WebhookDetailType } from '@asap-hub/model';
import { AWS } from '@serverless/typescript';
import {
  activeCampaignAccount,
  activeCampaignToken,
  algoliaIndex,
  envAlias,
  eventBusSourceContentful,
  isProd,
  opensearchMasterPassword,
  opensearchMasterUser,
  queueArn,
  queueUrl,
  sentryDsnHandlers,
  sesRegion,
} from './shared';

export const asyncFunctions: AWS['functions'] = {
  gcalSubscribeCalendarContentful: {
    handler: './src/handlers/calendar/gcal-subscribe-handler.handler',
    events: [
      {
        eventBridge: {
          eventBus: 'asap-events-${self:provider.stage}',
          pattern: {
            source: [eventBusSourceContentful],
            'detail-type': ['CalendarsPublished'] satisfies WebhookDetailType[],
          },
        },
      },
    ],
    environment: {
      GOOGLE_API_CREDENTIALS_SECRET_ID: `google-api-credentials-${envAlias}`,
      GOOGLE_API_TOKEN: `\${ssm:google-api-token-${envAlias}}`,
      SENTRY_DSN: sentryDsnHandlers,
      LOG_LEVEL: 'warn',
    },
  },
  gcalUnsubscribeCalendarsContentful: {
    handler: './src/handlers/calendar/gcal-unsubscribe-handler.handler',
    timeout: 120,
    events: [
      {
        schedule: 'cron(0 1 * * ? *)',
      },
    ],
    environment: {
      GOOGLE_API_CREDENTIALS_SECRET_ID: `google-api-credentials-${envAlias}`,
      GOOGLE_API_TOKEN: `\${ssm:google-api-token-${envAlias}}`,
      SENTRY_DSN: sentryDsnHandlers,
      LOG_LEVEL: 'warn',
    },
  },
  syncActiveCampaignContact: {
    handler: './src/handlers/user/sync-active-campaign-contact.handler',
    events: [
      {
        eventBridge: {
          eventBus: 'asap-events-${self:provider.stage}',
          pattern: {
            source: [eventBusSourceContentful],
            'detail-type': ['UsersPublished'] satisfies WebhookDetailType[],
          },
        },
      },
    ],
    environment: {
      ACTIVE_CAMPAIGN_ACCOUNT: activeCampaignAccount,
      ACTIVE_CAMPAIGN_TOKEN: activeCampaignToken,
      SENTRY_DSN: sentryDsnHandlers,
    },
  },
  syncActiveCampaignTeamMemberStatus: {
    handler:
      './src/handlers/teams/sync-active-campaign-team-member-status.handler',
    events: [
      {
        eventBridge: {
          eventBus: 'asap-events-${self:provider.stage}',
          pattern: {
            source: [eventBusSourceContentful],
            'detail-type': ['TeamsPublished'] satisfies WebhookDetailType[],
          },
        },
      },
    ],
    environment: {
      ACTIVE_CAMPAIGN_ACCOUNT: activeCampaignAccount,
      ACTIVE_CAMPAIGN_TOKEN: activeCampaignToken,
      SENTRY_DSN: sentryDsnHandlers,
    },
  },
  syncUserOrcidContentful: {
    handler: './src/handlers/user/sync-orcid-handler.handler',
    events: [
      {
        eventBridge: {
          eventBus: 'asap-events-${self:provider.stage}',
          pattern: {
            source: [eventBusSourceContentful],
            'detail-type': ['UsersPublished'] satisfies WebhookDetailType[],
          },
          retryPolicy: {
            maximumRetryAttempts: 2,
          },
        },
      },
    ],
    environment: {
      SENTRY_DSN: sentryDsnHandlers,
    },
  },
  inviteEventForwarder: {
    handler: 'src/handlers/user/forward-invite-handler.handler',
    events: [
      {
        eventBridge: {
          eventBus: 'asap-events-${self:provider.stage}',
          pattern: {
            source: [eventBusSourceContentful],
            'detail-type': ['UsersPublished'] satisfies WebhookDetailType[],
          },
          retryPolicy: {
            maximumRetryAttempts: 2,
          },
        },
      },
    ],
    environment: {
      QUEUE_URL: queueUrl('invite-user-queue'),
      SENTRY_DSN: sentryDsnHandlers,
    },
  },
  inviteUserContentful: {
    timeout: 120,
    handler: 'src/handlers/user/invite-handler.sqsHandler',
    events: [
      {
        sqs: {
          arn: queueArn('invite-user-queue'),
          batchSize: 1,
        },
      },
    ],
    environment: {
      SES_REGION: sesRegion,
      EMAIL_SENDER: `\${ssm:email-invite-sender-${envAlias}}`,
      EMAIL_BCC: `\${ssm:email-invite-bcc-${envAlias}}`,
      EMAIL_RETURN: `\${ssm:email-invite-return-${envAlias}}`,
      SENTRY_DSN: sentryDsnHandlers,
    },
  },
  algoliaIndexResearchOutput: {
    handler:
      './src/handlers/research-output/algolia-index-research-output-handler.handler',
    events: [
      {
        eventBridge: {
          eventBus: 'asap-events-${self:provider.stage}',
          pattern: {
            source: [eventBusSourceContentful],
            'detail-type': [
              'ResearchOutputsPublished',
              'ResearchOutputsUnpublished',
            ] satisfies WebhookDetailType[],
          },
        },
      },
    ],
    environment: {
      ALGOLIA_API_KEY: `\${ssm:crn-algolia-index-api-key-${envAlias}}`,
      ALGOLIA_INDEX: `${algoliaIndex}`,
      SENTRY_DSN: sentryDsnHandlers,
    },
  },
  algoliaIndexUser: {
    handler: './src/handlers/user/algolia-index-user-handler.handler',
    events: [
      {
        eventBridge: {
          eventBus: 'asap-events-${self:provider.stage}',
          pattern: {
            source: [eventBusSourceContentful],
            'detail-type': [
              'UsersPublished',
              'UsersUnpublished',
              'TeamMembershipPublished',
              'TeamMembershipUnpublished',
            ] satisfies WebhookDetailType[],
          },
        },
      },
    ],
    environment: {
      ALGOLIA_API_KEY: `\${ssm:crn-algolia-index-api-key-${envAlias}}`,
      ALGOLIA_INDEX: `${algoliaIndex}`,
      SENTRY_DSN: sentryDsnHandlers,
    },
  },
  algoliaIndexExternalAuthor: {
    handler:
      './src/handlers/external-author/algolia-index-external-author-handler.handler',
    events: [
      {
        eventBridge: {
          eventBus: 'asap-events-${self:provider.stage}',
          pattern: {
            source: [eventBusSourceContentful],
            'detail-type': [
              'ExternalAuthorsPublished',
              'ExternalAuthorsUnpublished',
            ] satisfies WebhookDetailType[],
          },
        },
      },
    ],
    environment: {
      ALGOLIA_API_KEY: `\${ssm:crn-algolia-index-api-key-${envAlias}}`,
      ALGOLIA_INDEX: `${algoliaIndex}`,
      SENTRY_DSN: sentryDsnHandlers,
    },
  },
  algoliaIndexEvents: {
    handler: './src/handlers/event/algolia-index-event-handler.handler',
    events: [
      {
        eventBridge: {
          eventBus: 'asap-events-${self:provider.stage}',
          pattern: {
            source: [eventBusSourceContentful],
            'detail-type': [
              'EventsPublished',
              'EventsUnpublished',
            ] satisfies WebhookDetailType[],
          },
        },
      },
    ],
    environment: {
      ALGOLIA_API_KEY: `\${ssm:crn-algolia-index-api-key-${envAlias}}`,
      ALGOLIA_INDEX: `${algoliaIndex}`,
      SENTRY_DSN: sentryDsnHandlers,
    },
  },
  algoliaIndexUserEvents: {
    handler: './src/handlers/event/algolia-index-user-events-handler.handler',
    events: [
      {
        eventBridge: {
          eventBus: 'asap-events-${self:provider.stage}',
          pattern: {
            source: [eventBusSourceContentful],
            'detail-type': [
              'UsersPublished',
              'UsersUnpublished',
            ] satisfies WebhookDetailType[],
          },
        },
      },
    ],
    environment: {
      ALGOLIA_API_KEY: `\${ssm:crn-algolia-index-api-key-${envAlias}}`,
      ALGOLIA_INDEX: `${algoliaIndex}`,
      SENTRY_DSN: sentryDsnHandlers,
    },
  },
  algoliaIndexExternalUserEvents: {
    handler:
      './src/handlers/event/algolia-index-external-author-events-handler.handler',
    events: [
      {
        eventBridge: {
          eventBus: 'asap-events-${self:provider.stage}',
          pattern: {
            source: [eventBusSourceContentful],
            'detail-type': [
              'ExternalAuthorsPublished',
              'ExternalAuthorsUnpublished',
            ] satisfies WebhookDetailType[],
          },
        },
      },
    ],
    environment: {
      ALGOLIA_API_KEY: `\${ssm:crn-algolia-index-api-key-${envAlias}}`,
      ALGOLIA_INDEX: `${algoliaIndex}`,
      SENTRY_DSN: sentryDsnHandlers,
    },
  },
  algoliaIndexTeamEvents: {
    handler: './src/handlers/event/algolia-index-team-events-handler.handler',
    events: [
      {
        eventBridge: {
          eventBus: 'asap-events-${self:provider.stage}',
          pattern: {
            source: [eventBusSourceContentful],
            'detail-type': [
              'TeamsPublished',
              'TeamsUnpublished',
            ] satisfies WebhookDetailType[],
          },
        },
      },
    ],
    environment: {
      ALGOLIA_API_KEY: `\${ssm:crn-algolia-index-api-key-${envAlias}}`,
      ALGOLIA_INDEX: `${algoliaIndex}`,
      SENTRY_DSN: sentryDsnHandlers,
    },
  },
  algoliaIndexGroupEvents: {
    handler: './src/handlers/event/algolia-index-group-events-handler.handler',
    events: [
      {
        eventBridge: {
          eventBus: 'asap-events-${self:provider.stage}',
          pattern: {
            source: [eventBusSourceContentful],
            'detail-type': [
              'InterestGroupsPublished',
              'InterestGroupsUnpublished',
            ] satisfies WebhookDetailType[],
          },
        },
      },
    ],
    environment: {
      ALGOLIA_API_KEY: `\${ssm:crn-algolia-index-api-key-${envAlias}}`,
      ALGOLIA_INDEX: `${algoliaIndex}`,
      SENTRY_DSN: sentryDsnHandlers,
    },
  },
  algoliaIndexLabUsers: {
    handler: './src/handlers/lab/algolia-index-lab-users-handler.handler',
    events: [
      {
        eventBridge: {
          eventBus: 'asap-events-${self:provider.stage}',
          pattern: {
            source: [eventBusSourceContentful],
            'detail-type': [
              'LabsPublished',
              'LabsUnpublished',
            ] satisfies WebhookDetailType[],
          },
        },
      },
    ],
    environment: {
      ALGOLIA_API_KEY: `\${ssm:crn-algolia-index-api-key-${envAlias}}`,
      ALGOLIA_INDEX: `${algoliaIndex}`,
      SENTRY_DSN: sentryDsnHandlers,
    },
  },
  gcalEventsUpdatedContentfulProcess: {
    timeout: 300,
    handler:
      './src/handlers/webhooks/gcal-webhook-events-updated-process.handler',
    events: [
      {
        sqs: {
          arn: queueArn('google-calendar-event-queue'),
          batchSize: 1,
          maximumConcurrency: 2,
        },
      },
    ],
    environment: {
      GOOGLE_API_CREDENTIALS_SECRET_ID: `google-api-credentials-${envAlias}`,
      SENTRY_DSN: sentryDsnHandlers,
      LOG_LEVEL: 'warn',
    },
  },
  algoliaIndexTeams: {
    handler: './src/handlers/teams/algolia-index-team-handler.handler',
    events: [
      {
        eventBridge: {
          eventBus: 'asap-events-${self:provider.stage}',
          pattern: {
            source: [eventBusSourceContentful],
            'detail-type': [
              'TeamsPublished',
              'TeamsUnpublished',
            ] satisfies WebhookDetailType[],
          },
        },
      },
    ],
    environment: {
      ALGOLIA_API_KEY: `\${ssm:crn-algolia-index-api-key-${envAlias}}`,
      ALGOLIA_INDEX: `${algoliaIndex}`,
      SENTRY_DSN: sentryDsnHandlers,
    },
  },
  algoliaIndexTeamResearchOutputs: {
    handler:
      './src/handlers/teams/algolia-index-team-research-outputs-handler.handler',
    events: [
      {
        eventBridge: {
          eventBus: 'asap-events-${self:provider.stage}',
          pattern: {
            source: [eventBusSourceContentful],
            'detail-type': [
              'TeamsPublished',
              'TeamsUnpublished',
            ] satisfies WebhookDetailType[],
          },
        },
      },
    ],
    environment: {
      ALGOLIA_API_KEY: `\${ssm:crn-algolia-index-api-key-${envAlias}}`,
      ALGOLIA_INDEX: `${algoliaIndex}`,
      SENTRY_DSN: sentryDsnHandlers,
    },
  },
  algoliaIndexTeamUsers: {
    handler: './src/handlers/teams/algolia-index-team-users-handler.handler',
    events: [
      {
        eventBridge: {
          eventBus: 'asap-events-${self:provider.stage}',
          pattern: {
            source: [eventBusSourceContentful],
            'detail-type': [
              'TeamsPublished',
              'TeamsUnpublished',
            ] satisfies WebhookDetailType[],
          },
        },
      },
    ],
    environment: {
      ALGOLIA_API_KEY: `\${ssm:crn-algolia-index-api-key-${envAlias}}`,
      ALGOLIA_INDEX: `${algoliaIndex}`,
      SENTRY_DSN: sentryDsnHandlers,
    },
  },
  algoliaIndexProjectTeam: {
    handler:
      './src/handlers/project/algolia-index-project-team-handler.handler',
    events: [
      {
        eventBridge: {
          eventBus: 'asap-events-${self:provider.stage}',
          pattern: {
            source: [eventBusSourceContentful],
            'detail-type': ['ProjectsPublished', 'ProjectsUnpublished'],
          },
        },
      },
    ],
    environment: {
      ALGOLIA_API_KEY: `\${ssm:crn-algolia-index-api-key-${envAlias}}`,
      ALGOLIA_INDEX: `${algoliaIndex}`,
      SENTRY_DSN: sentryDsnHandlers,
    },
  },
  algoliaIndexNews: {
    handler: './src/handlers/news/algolia-index-news-handler.handler',
    events: [
      {
        eventBridge: {
          eventBus: 'asap-events-${self:provider.stage}',
          pattern: {
            source: [eventBusSourceContentful],
            'detail-type': ['NewsPublished', 'NewsUnpublished'],
          },
        },
      },
    ],
    environment: {
      ALGOLIA_API_KEY: `\${ssm:crn-algolia-index-api-key-${envAlias}}`,
      ALGOLIA_INDEX: `${algoliaIndex}`,
      SENTRY_DSN: sentryDsnHandlers,
    },
  },
  algoliaIndexProjects: {
    handler: './src/handlers/project/algolia-index-project-handler.handler',
    events: [
      {
        eventBridge: {
          eventBus: 'asap-events-${self:provider.stage}',
          pattern: {
            source: [eventBusSourceContentful],
            'detail-type': [
              'ProjectsPublished',
              'ProjectsUnpublished',
            ] satisfies WebhookDetailType[],
          },
        },
      },
    ],
    environment: {
      ALGOLIA_API_KEY: `\${ssm:crn-algolia-index-api-key-${envAlias}}`,
      ALGOLIA_INDEX: `${algoliaIndex}`,
      SENTRY_DSN: sentryDsnHandlers,
    },
  },
  algoliaIndexTeamProjects: {
    handler:
      './src/handlers/project/algolia-index-team-projects-handler.handler',
    events: [
      {
        eventBridge: {
          eventBus: 'asap-events-${self:provider.stage}',
          pattern: {
            source: [eventBusSourceContentful],
            'detail-type': [
              'TeamsPublished',
              'TeamsUnpublished',
            ] satisfies WebhookDetailType[],
          },
        },
      },
    ],
    environment: {
      ALGOLIA_API_KEY: `\${ssm:crn-algolia-index-api-key-${envAlias}}`,
      ALGOLIA_INDEX: `${algoliaIndex}`,
      SENTRY_DSN: sentryDsnHandlers,
    },
  },
  algoliaIndexUserProjects: {
    handler:
      './src/handlers/project/algolia-index-user-projects-handler.handler',
    events: [
      {
        eventBridge: {
          eventBus: 'asap-events-${self:provider.stage}',
          pattern: {
            source: [eventBusSourceContentful],
            'detail-type': [
              'UsersPublished',
              'UsersUnpublished',
            ] satisfies WebhookDetailType[],
          },
        },
      },
    ],
    environment: {
      ALGOLIA_API_KEY: `\${ssm:crn-algolia-index-api-key-${envAlias}}`,
      ALGOLIA_INDEX: `${algoliaIndex}`,
      SENTRY_DSN: sentryDsnHandlers,
    },
  },
  algoliaIndexProjectMembership: {
    handler:
      './src/handlers/project/algolia-index-project-membership-handler.handler',
    events: [
      {
        eventBridge: {
          eventBus: 'asap-events-${self:provider.stage}',
          pattern: {
            source: [eventBusSourceContentful],
            'detail-type': [
              'ProjectMembershipPublished',
              'ProjectMembershipUnpublished',
            ] satisfies WebhookDetailType[],
          },
        },
      },
    ],
    environment: {
      ALGOLIA_API_KEY: `\${ssm:crn-algolia-index-api-key-${envAlias}}`,
      ALGOLIA_INDEX: `${algoliaIndex}`,
      SENTRY_DSN: sentryDsnHandlers,
    },
  },
  algoliaIndexTutorials: {
    handler: './src/handlers/tutorials/algolia-index-tutorials-handler.handler',
    events: [
      {
        eventBridge: {
          eventBus: 'asap-events-${self:provider.stage}',
          pattern: {
            source: [eventBusSourceContentful],
            'detail-type': ['TutorialsPublished', 'TutorialsUnpublished'],
          },
        },
      },
    ],
    environment: {
      ALGOLIA_API_KEY: `\${ssm:crn-algolia-index-api-key-${envAlias}}`,
      ALGOLIA_INDEX: `${algoliaIndex}`,
      SENTRY_DSN: sentryDsnHandlers,
    },
  },
  algoliaIndexWorkingGroups: {
    handler:
      './src/handlers/working-group/algolia-index-working-group-handler.handler',
    events: [
      {
        eventBridge: {
          eventBus: 'asap-events-${self:provider.stage}',
          pattern: {
            source: [eventBusSourceContentful],
            'detail-type': [
              'WorkingGroupsPublished',
              'WorkingGroupsUnpublished',
            ],
          },
        },
      },
    ],
    environment: {
      ALGOLIA_API_KEY: `\${ssm:crn-algolia-index-api-key-${envAlias}}`,
      ALGOLIA_INDEX: `${algoliaIndex}`,
      SENTRY_DSN: sentryDsnHandlers,
    },
  },
  algoliaIndexInterestGroups: {
    handler:
      './src/handlers/interest-group/algolia-index-interest-group-handler.handler',
    events: [
      {
        eventBridge: {
          eventBus: 'asap-events-${self:provider.stage}',
          pattern: {
            source: [eventBusSourceContentful],
            'detail-type': [
              'InterestGroupsPublished',
              'InterestGroupsUnpublished',
            ],
          },
        },
      },
    ],
    environment: {
      ALGOLIA_API_KEY: `\${ssm:crn-algolia-index-api-key-${envAlias}}`,
      ALGOLIA_INDEX: `${algoliaIndex}`,
      SENTRY_DSN: sentryDsnHandlers,
    },
  },
  algoliaIndexManuscripts: {
    handler:
      './src/handlers/manuscript/algolia-index-manuscript-handler.handler',
    events: [
      {
        eventBridge: {
          eventBus: 'asap-events-${self:provider.stage}',
          pattern: {
            source: [eventBusSourceContentful],
            'detail-type': ['ManuscriptsPublished', 'ManuscriptsUnpublished'],
          },
        },
      },
    ],
    environment: {
      ALGOLIA_API_KEY: `\${ssm:crn-algolia-index-api-key-${envAlias}}`,
      ALGOLIA_INDEX: `${algoliaIndex}`,
      SENTRY_DSN: sentryDsnHandlers,
    },
  },
  algoliaIndexManuscriptVersions: {
    handler:
      './src/handlers/manuscript-version/algolia-index-manuscript-versions-handler.handler',
    events: [
      {
        eventBridge: {
          eventBus: 'asap-events-${self:provider.stage}',
          pattern: {
            source: [eventBusSourceContentful],
            'detail-type': [
              'ManuscriptVersionsPublished',
              'ManuscriptVersionsUnpublished',
            ],
          },
        },
      },
    ],
    environment: {
      ALGOLIA_API_KEY: `\${ssm:crn-algolia-index-api-key-${envAlias}}`,
      ALGOLIA_INDEX: `${algoliaIndex}`,
      SENTRY_DSN: sentryDsnHandlers,
    },
  },
  algoliaIndexManuscriptVersionsManuscripts: {
    handler:
      './src/handlers/manuscript/algolia-index-manuscript-versions-manuscripts-handler.handler',
    events: [
      {
        eventBridge: {
          eventBus: 'asap-events-${self:provider.stage}',
          pattern: {
            source: [eventBusSourceContentful],
            'detail-type': ['ManuscriptsPublished', 'ManuscriptsUnpublished'],
          },
        },
      },
    ],
    environment: {
      ALGOLIA_API_KEY: `\${ssm:crn-algolia-index-api-key-${envAlias}}`,
      ALGOLIA_INDEX: `${algoliaIndex}`,
      SENTRY_DSN: sentryDsnHandlers,
    },
  },
  updateContentfulWorkingGroupDeliverables: {
    handler: './src/handlers/working-group/update-deliverables-handler.handler',
    events: [
      {
        eventBridge: {
          eventBus: 'asap-events-${self:provider.stage}',
          pattern: {
            source: [eventBusSourceContentful],
            'detail-type': [
              'WorkingGroupsPublished',
            ] satisfies WebhookDetailType[],
          },
        },
      },
    ],
    environment: {
      SENTRY_DSN: sentryDsnHandlers,
    },
  },
  ...(isProd && {
    complianceSpreadsheetEntryHandler: {
      handler:
        './src/handlers/compliance-sheet/compliance-entry-handler.handler',
      events: [
        {
          eventBridge: {
            eventBus: 'asap-events-${self:provider.stage}',
            pattern: {
              source: [eventBusSourceContentful],
              'detail-type': [
                'ManuscriptVersionsPublished',
                'ManuscriptsPublished',
                'ProjectsPublished',
                'ComplianceReportsPublished',
                'UsersPublished',
                'TeamsPublished',
                'LabsPublished',
                'ExternalAuthorsPublished',
                'ImpactPublished',
                'CategoryPublished',
                'ManuscriptVersionsUnpublished',
                'ManuscriptsUnpublished',
                'UsersUnpublished',
                'TeamsUnpublished',
                'ProjectsUnpublished',
                'ComplianceReportsUnpublished',
                'LabsUnpublished',
                'ExternalAuthorsUnpublished',
                'CategoryUnpublished',
                'ImpactUnpublished',
              ],
            },
          },
        },
      ],
      environment: {
        SENTRY_DSN: sentryDsnHandlers,
        COMPLIANCE_DOC_SYNC_QUEUE_URL: queueUrl('compliance-doc-sync-queue'),
      },
    },
    complianceSpreadsheetSyncHandler: {
      handler:
        './src/handlers/compliance-sheet/compliance-spreadsheet-sync-handler.handler',
      timeout: 40,
      reservedConcurrency: 1,
      events: [
        {
          sqs: {
            arn: queueArn('compliance-doc-sync-queue'),
            batchSize: 5,
          },
        },
      ],
      environment: {
        SENTRY_DSN: sentryDsnHandlers,
        COMPLIANCE_LIVE_SHEET_ID: `\${ssm:compliance-live-sheet-id}`,
        GOOGLE_API_CREDENTIALS_SECRET_ID: `google-api-credentials-prod`,
      },
    },
  }),
  contentfulWebhookPoller: {
    handler: './src/handlers/webhooks/webhook-contentful-poller.handler',
    timeout: 20,
    reservedConcurrency: 2,
    events: [
      {
        sqs: {
          arn: queueArn('contentful-poller-queue'),
          batchSize: 1,
          maximumConcurrency: 2,
        },
      },
    ],
    environment: {
      EVENT_BUS: 'asap-events-${self:provider.stage}',
      EVENT_SOURCE: eventBusSourceContentful,
      SENTRY_DSN: sentryDsnHandlers,
    },
  },
  cronjobSyncOrcidContentful: {
    handler: './src/handlers/user/cronjob-sync-orcid.handler',
    timeout: 120,
    events: [
      {
        schedule: 'rate(1 hour)', // run every hour
      },
    ],
    environment: {
      SENTRY_DSN: sentryDsnHandlers,
    },
  },
  opensearchIndexAims: {
    handler: './src/handlers/aim/opensearch-index-aim-handler.handler',
    timeout: 120,
    memorySize: 512,
    events: [
      {
        eventBridge: {
          eventBus: 'asap-events-${self:provider.stage}',
          pattern: {
            source: [eventBusSourceContentful],
            'detail-type': [
              'AimsPublished',
              'AimsUnpublished',
              'ProjectsPublished',
              'ProjectsUnpublished',
              'SupplementGrantPublished',
              'SupplementGrantUnpublished',
            ] satisfies WebhookDetailType[],
          },
        },
      },
    ],
    environment: {
      SENTRY_DSN: sentryDsnHandlers,
      OPENSEARCH_USERNAME: opensearchMasterUser,
      OPENSEARCH_PASSWORD: opensearchMasterPassword,
    },
  },
  opensearchIndexMilestones: {
    handler:
      './src/handlers/milestone/opensearch-index-milestone-handler.handler',
    timeout: 120,
    memorySize: 512,
    events: [
      {
        eventBridge: {
          eventBus: 'asap-events-${self:provider.stage}',
          pattern: {
            source: [eventBusSourceContentful],
            'detail-type': [
              'MilestonesPublished',
              'MilestonesUnpublished',
            ] satisfies WebhookDetailType[],
          },
        },
      },
    ],
    environment: {
      SENTRY_DSN: sentryDsnHandlers,
      OPENSEARCH_USERNAME: opensearchMasterUser,
      OPENSEARCH_PASSWORD: opensearchMasterPassword,
    },
  },
};
