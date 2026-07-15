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

const contentfulEventBridge = (
  detailTypes: WebhookDetailType[],
  retryPolicy?: { maximumRetryAttempts: number },
) => [
  {
    eventBridge: {
      eventBus: 'asap-events-${self:provider.stage}',
      pattern: {
        source: [eventBusSourceContentful],
        'detail-type': detailTypes,
      },
      ...(retryPolicy ? { retryPolicy } : {}),
    },
  },
];

const algoliaIndexEnvironment = {
  ALGOLIA_API_KEY: `\${ssm:crn-algolia-index-api-key-${envAlias}}`,
  ALGOLIA_INDEX: `${algoliaIndex}`,
  SENTRY_DSN: sentryDsnHandlers,
};

const algoliaIndexer = (handler: string, detailTypes: WebhookDetailType[]) => ({
  handler,
  events: contentfulEventBridge(detailTypes),
  environment: algoliaIndexEnvironment,
});

const googleCalendarEnvironment = {
  GOOGLE_API_CREDENTIALS_SECRET_ID: `google-api-credentials-${envAlias}`,
  GOOGLE_API_TOKEN: `\${ssm:google-api-token-${envAlias}}`,
  SENTRY_DSN: sentryDsnHandlers,
  LOG_LEVEL: 'warn',
};

const activeCampaignEnvironment = {
  ACTIVE_CAMPAIGN_ACCOUNT: activeCampaignAccount,
  ACTIVE_CAMPAIGN_TOKEN: activeCampaignToken,
  SENTRY_DSN: sentryDsnHandlers,
};

const opensearchIndexerEnvironment = {
  SENTRY_DSN: sentryDsnHandlers,
  OPENSEARCH_USERNAME: opensearchMasterUser,
  OPENSEARCH_PASSWORD: opensearchMasterPassword,
};

export const asyncFunctions: AWS['functions'] = {
  gcalSubscribeCalendarContentful: {
    handler: './src/handlers/calendar/gcal-subscribe-handler.handler',
    events: contentfulEventBridge(['CalendarsPublished']),
    environment: googleCalendarEnvironment,
  },
  gcalUnsubscribeCalendarsContentful: {
    handler: './src/handlers/calendar/gcal-unsubscribe-handler.handler',
    timeout: 120,
    events: [
      {
        schedule: 'cron(0 1 * * ? *)',
      },
    ],
    environment: googleCalendarEnvironment,
  },
  syncActiveCampaignContact: {
    handler: './src/handlers/user/sync-active-campaign-contact.handler',
    events: contentfulEventBridge(['UsersPublished']),
    environment: activeCampaignEnvironment,
  },
  syncActiveCampaignTeamMemberStatus: {
    handler:
      './src/handlers/teams/sync-active-campaign-team-member-status.handler',
    events: contentfulEventBridge(['TeamsPublished']),
    environment: activeCampaignEnvironment,
  },
  syncUserOrcidContentful: {
    handler: './src/handlers/user/sync-orcid-handler.handler',
    events: contentfulEventBridge(['UsersPublished'], {
      maximumRetryAttempts: 2,
    }),
    environment: {
      SENTRY_DSN: sentryDsnHandlers,
    },
  },
  inviteEventForwarder: {
    handler: 'src/handlers/user/forward-invite-handler.handler',
    events: contentfulEventBridge(['UsersPublished'], {
      maximumRetryAttempts: 2,
    }),
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
  algoliaIndexResearchOutput: algoliaIndexer(
    './src/handlers/research-output/algolia-index-research-output-handler.handler',
    ['ResearchOutputsPublished', 'ResearchOutputsUnpublished'],
  ),
  algoliaIndexUser: algoliaIndexer(
    './src/handlers/user/algolia-index-user-handler.handler',
    [
      'UsersPublished',
      'UsersUnpublished',
      'TeamMembershipPublished',
      'TeamMembershipUnpublished',
    ],
  ),
  algoliaIndexExternalAuthor: algoliaIndexer(
    './src/handlers/external-author/algolia-index-external-author-handler.handler',
    ['ExternalAuthorsPublished', 'ExternalAuthorsUnpublished'],
  ),
  algoliaIndexEvents: algoliaIndexer(
    './src/handlers/event/algolia-index-event-handler.handler',
    ['EventsPublished', 'EventsUnpublished'],
  ),
  algoliaIndexUserEvents: algoliaIndexer(
    './src/handlers/event/algolia-index-user-events-handler.handler',
    ['UsersPublished', 'UsersUnpublished'],
  ),
  algoliaIndexExternalUserEvents: algoliaIndexer(
    './src/handlers/event/algolia-index-external-author-events-handler.handler',
    ['ExternalAuthorsPublished', 'ExternalAuthorsUnpublished'],
  ),
  algoliaIndexTeamEvents: algoliaIndexer(
    './src/handlers/event/algolia-index-team-events-handler.handler',
    ['TeamsPublished', 'TeamsUnpublished'],
  ),
  algoliaIndexGroupEvents: algoliaIndexer(
    './src/handlers/event/algolia-index-group-events-handler.handler',
    ['InterestGroupsPublished', 'InterestGroupsUnpublished'],
  ),
  algoliaIndexLabUsers: algoliaIndexer(
    './src/handlers/lab/algolia-index-lab-users-handler.handler',
    ['LabsPublished', 'LabsUnpublished'],
  ),
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
  algoliaIndexTeams: algoliaIndexer(
    './src/handlers/teams/algolia-index-team-handler.handler',
    ['TeamsPublished', 'TeamsUnpublished'],
  ),
  algoliaIndexTeamResearchOutputs: algoliaIndexer(
    './src/handlers/teams/algolia-index-team-research-outputs-handler.handler',
    ['TeamsPublished', 'TeamsUnpublished'],
  ),
  algoliaIndexTeamUsers: algoliaIndexer(
    './src/handlers/teams/algolia-index-team-users-handler.handler',
    ['TeamsPublished', 'TeamsUnpublished'],
  ),
  algoliaIndexProjectTeam: algoliaIndexer(
    './src/handlers/project/algolia-index-project-team-handler.handler',
    ['ProjectsPublished', 'ProjectsUnpublished'],
  ),
  algoliaIndexNews: algoliaIndexer(
    './src/handlers/news/algolia-index-news-handler.handler',
    ['NewsPublished', 'NewsUnpublished'],
  ),
  algoliaIndexProjects: algoliaIndexer(
    './src/handlers/project/algolia-index-project-handler.handler',
    ['ProjectsPublished', 'ProjectsUnpublished'],
  ),
  algoliaIndexTeamProjects: algoliaIndexer(
    './src/handlers/project/algolia-index-team-projects-handler.handler',
    ['TeamsPublished', 'TeamsUnpublished'],
  ),
  algoliaIndexUserProjects: algoliaIndexer(
    './src/handlers/project/algolia-index-user-projects-handler.handler',
    ['UsersPublished', 'UsersUnpublished'],
  ),
  algoliaIndexProjectMembership: algoliaIndexer(
    './src/handlers/project/algolia-index-project-membership-handler.handler',
    ['ProjectMembershipPublished', 'ProjectMembershipUnpublished'],
  ),
  algoliaIndexTutorials: algoliaIndexer(
    './src/handlers/tutorials/algolia-index-tutorials-handler.handler',
    ['TutorialsPublished', 'TutorialsUnpublished'],
  ),
  algoliaIndexWorkingGroups: algoliaIndexer(
    './src/handlers/working-group/algolia-index-working-group-handler.handler',
    ['WorkingGroupsPublished', 'WorkingGroupsUnpublished'],
  ),
  algoliaIndexInterestGroups: algoliaIndexer(
    './src/handlers/interest-group/algolia-index-interest-group-handler.handler',
    ['InterestGroupsPublished', 'InterestGroupsUnpublished'],
  ),
  algoliaIndexManuscripts: algoliaIndexer(
    './src/handlers/manuscript/algolia-index-manuscript-handler.handler',
    ['ManuscriptsPublished', 'ManuscriptsUnpublished'],
  ),
  algoliaIndexManuscriptVersions: algoliaIndexer(
    './src/handlers/manuscript-version/algolia-index-manuscript-versions-handler.handler',
    ['ManuscriptVersionsPublished', 'ManuscriptVersionsUnpublished'],
  ),
  algoliaIndexManuscriptVersionsManuscripts: algoliaIndexer(
    './src/handlers/manuscript/algolia-index-manuscript-versions-manuscripts-handler.handler',
    ['ManuscriptsPublished', 'ManuscriptsUnpublished'],
  ),
  updateContentfulWorkingGroupDeliverables: {
    handler: './src/handlers/working-group/update-deliverables-handler.handler',
    events: contentfulEventBridge(['WorkingGroupsPublished']),
    environment: {
      SENTRY_DSN: sentryDsnHandlers,
    },
  },
  ...(isProd && {
    complianceSpreadsheetEntryHandler: {
      handler:
        './src/handlers/compliance-sheet/compliance-entry-handler.handler',
      events: contentfulEventBridge([
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
      ]),
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
    events: contentfulEventBridge([
      'AimsPublished',
      'AimsUnpublished',
      'ProjectsPublished',
      'ProjectsUnpublished',
      'SupplementGrantPublished',
      'SupplementGrantUnpublished',
    ]),
    environment: opensearchIndexerEnvironment,
  },
  opensearchIndexMilestones: {
    handler:
      './src/handlers/milestone/opensearch-index-milestone-handler.handler',
    timeout: 120,
    memorySize: 512,
    events: contentfulEventBridge([
      'MilestonesPublished',
      'MilestonesUnpublished',
    ]),
    environment: opensearchIndexerEnvironment,
  },
};
