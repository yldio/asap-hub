import { WebhookDetailType } from '@asap-hub/model';
import { AWS } from '@serverless/typescript';
import assert from 'assert';

[
  'ACTIVE_CAMPAIGN_ACCOUNT',
  'ALGOLIA_INDEX',
  'AUTH0_AUDIENCE',
  'AUTH0_CLIENT_ID',
  'AUTH0_SHARED_SECRET',
  'AWS_ACM_CERTIFICATE_ARN',
  'AWS_REGION',
  'CONTENTFUL_ACCESS_TOKEN',
  'CONTENTFUL_ENV',
  'CONTENTFUL_MANAGEMENT_ACCESS_TOKEN',
  'CONTENTFUL_PREVIEW_ACCESS_TOKEN',
  'CONTENTFUL_SPACE_ID',
  'CONTENTFUL_WEBHOOK_AUTHENTICATION_TOKEN',
  'HOSTNAME',
  'OPENAI_API_KEY',
  'POSTMARK_SERVER_TOKEN',
  'SES_REGION',
  'SLACK_WEBHOOK',
  'SLS_STAGE',
].forEach((env) => {
  assert.ok(process.env[env], `${env} not defined`);
});

const stage = process.env.SLS_STAGE!;
assert.ok(
  stage === 'dev' || stage === 'production' || !isNaN(Number.parseInt(stage)),
  'stage must be either "dev" or "production" or a PR number',
);

const region = process.env.AWS_REGION as NonNullable<AWS['provider']['region']>;
const envAlias = stage === 'production' ? 'prod' : 'dev';
const envRef =
  stage === 'production' ? 'prod' : stage === 'dev' ? 'dev' : `CI-${stage}`;

if (stage === 'dev' || stage === 'production') {
  ['SENTRY_DSN_API', 'SENTRY_DSN_PUBLIC_API', 'SENTRY_DSN_HANDLERS'].forEach(
    (env) => {
      assert.ok(process.env[env], `${env} not defined`);
    },
  );
}

const activeCampaignAccount = process.env.ACTIVE_CAMPAIGN_ACCOUNT || '';
const activeCampaignToken = process.env.ACTIVE_CAMPAIGN_TOKEN!;
const sentryDsnApi = process.env.SENTRY_DSN_API!;
const sentryDsnPublicApi = process.env.SENTRY_DSN_PUBLIC_API!;
const sentryDsnHandlers = process.env.SENTRY_DSN_HANDLERS!;
const auth0ClientId = process.env.AUTH0_CLIENT_ID!;
const auth0Audience = process.env.AUTH0_AUDIENCE!;
const auth0SharedSecret = process.env.AUTH0_SHARED_SECRET!;
const contentfulEnvironment = process.env.CONTENTFUL_ENV!;
const contentfulAccessToken = process.env.CONTENTFUL_ACCESS_TOKEN!;
const contentfulPreviewAccessToken =
  process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN!;
const contentfulManagementAccessToken =
  process.env.CONTENTFUL_MANAGEMENT_ACCESS_TOKEN!;
const contentfulWebhookAuthenticationToken =
  process.env.CONTENTFUL_WEBHOOK_AUTHENTICATION_TOKEN!;
const contentfulSpaceId = process.env.CONTENTFUL_SPACE_ID!;
const sesRegion = process.env.SES_REGION!;
const hostname = process.env.HOSTNAME!;
const appHostname = stage === 'production' ? hostname : `${stage}.${hostname}`;
const apiHostname =
  stage === 'production' ? `api.${hostname}` : `api-${stage}.${hostname}`;
const appUrl = `https://${appHostname}`;
const apiUrl = `https://${apiHostname}`;
const nodeEnv = 'production';
const ciCommitSha = process.env.CI_COMMIT_SHA;
const currentRevision = process.env.CURRENT_REVISION!;
const awsAcmCertificateArn = process.env.AWS_ACM_CERTIFICATE_ARN!;
const slackWebhook = process.env.SLACK_WEBHOOK!;
const logLevel = process.env.LOG_LEVEL!;
const s3SyncEnabled = process.env.S3_SYNC_ENABLED !== 'false';
const openaiApiKey = process.env.OPENAI_API_KEY!;
const postmarkServerToken = process.env.POSTMARK_SERVER_TOKEN!;

const algoliaIndex = process.env.ALGOLIA_INDEX
  ? process.env.ALGOLIA_INDEX
  : `asap-hub_${envRef}`;
const service = 'asap-hub';

export const plugins = [
  './serverless-plugins/serverless-esbuild',
  './serverless-plugins/serverless-iam-roles-per-function',
  ...(s3SyncEnabled ? ['./serverless-plugins/serverless-s3-sync'] : []),
];
const offlinePlugins = [
  './serverless-plugins/serverless-offline',
  './serverless-plugins/serverless-offline-ssm',
  './serverless-plugins/serverless-offline-aws-eventbridge',
];

const offlineSSM =
  stage === 'local'
    ? {
        'algolia-app-id-dev': '${env:ALGOLIA_APP_ID}',
        'algolia-index-api-key-dev': '${env:ALGOLIA_API_KEY}',
        'algolia-search-api-key-dev': '${env:ALGOLIA_API_KEY}',
        'crn-algolia-app-id-dev': '${env:ALGOLIA_APP_ID}',
        'crn-algolia-index-api-key-dev': '${env:ALGOLIA_API_KEY}',
        'crn-algolia-search-api-key-dev': '${env:ALGOLIA_API_KEY}',
        'google-api-token-dev': '${env:GOOGLE_API_TOKEN}',
        'ses-region-dev': '${env:SES_REGION}',
        'email-invite-sender-dev': '${env:EMAIL_SENDER}',
        'email-invite-bcc-dev': '${env:EMAIL_BCC}',
        'email-invite-return-dev': '${env:EMAIL_RETURN}',
      }
    : {};

if (stage === 'local') {
  plugins.push(...offlinePlugins);
}

const eventBusSourceContentful = 'asap.contentful';

const serverlessConfig: AWS = {
  service,
  plugins,
  provider: {
    name: 'aws',
    runtime: 'nodejs20.x',
    architecture: 'arm64',
    timeout: 16,
    memorySize: 1024,
    region,
    stage,
    versionFunctions: false,
    httpApi: {
      payload: '2.0',
      cors: {
        allowedOrigins: [appUrl],
        allowCredentials: true,
        allowedMethods: ['OPTIONS', 'POST', 'GET', 'PUT', 'DELETE', 'PATCH'],
        allowedHeaders: [
          'authorization',
          'x-transaction-id',
          'content-type',
          'accept',
          'origin',
        ],
      },
    },
    logs: {
      httpApi: {
        format:
          '{ "requestId":"$context.requestId", "ip": "$context.identity.sourceIp", "requestTime":"$context.requestTime", "httpMethod":"$context.httpMethod", "path":"$context.path", "routeKey":"$context.routeKey", "status":"$context.status","protocol":"$context.protocol", "responseLength":"$context.responseLength", "integrationRequestId": "$context.integration.requestId", "functionResponseStatus": "$context.integration.status" }',
      },
    },
    tracing: {
      apiGateway: true,
      lambda: true,
    },
    environment: {
      ACTIVE_CAMPAIGN_ACCOUNT: activeCampaignAccount,
      ACTIVE_CAMPAIGN_TOKEN: activeCampaignToken,
      APP_ORIGIN: appUrl,
      DEBUG: stage === 'production' ? '' : 'crn-server,http',
      NODE_ENV: nodeEnv,
      ENVIRONMENT: stage,
      REGION: region,
      API_URL: apiUrl,
      LOG_LEVEL: logLevel || (stage === 'production' ? 'error' : 'info'),
      NODE_OPTIONS: '--enable-source-maps',
      ALGOLIA_APP_ID: `\${ssm:crn-algolia-app-id-${envAlias}}`,
      CURRENT_REVISION: ciCommitSha ?? currentRevision,
      CONTENTFUL_ENV_ID: contentfulEnvironment,
      CONTENTFUL_ACCESS_TOKEN: contentfulAccessToken,
      CONTENTFUL_PREVIEW_ACCESS_TOKEN: contentfulPreviewAccessToken,
      CONTENTFUL_MANAGEMENT_ACCESS_TOKEN: contentfulManagementAccessToken,
      CONTENTFUL_SPACE_ID: contentfulSpaceId,
    },
    iam: {
      role: {
        statements: [
          {
            Effect: 'Allow',
            Action: ['s3:PutObject', 's3:GetObject', 's3:DeleteObject'],
            Resource: {
              'Fn::Join': [
                '',
                [
                  'arn:aws:s3:::',
                  '${self:service}-${self:provider.stage}-files',
                  '/*',
                ],
              ],
            },
          },
          {
            Effect: 'Allow',
            Action: ['lambda:InvokeFunction'],
            Resource: {
              'Fn::Sub':
                'arn:aws:lambda:${AWS::Region}:${AWS::AccountId}:function:asap-hub-${self:provider.stage}-getPresignedUrl',
            },
          },
          {
            Effect: 'Allow',
            Action: [
              'dynamodb:PutItem',
              'dynamodb:Get*',
              'dynamodb:Update*',
              'dynamodb:Delete*',
            ],
            Resource: {
              'Fn::Join': [
                ':',
                [
                  'arn:aws:dynamodb',
                  { Ref: 'AWS::Region' },
                  { Ref: 'AWS::AccountId' },
                  'table/${self:service}-${self:provider.stage}-cookie-preferences',
                ],
              ],
            },
          },
          {
            Effect: 'Allow',
            Action: 'secretsmanager:*',
            Resource: {
              'Fn::Join': [
                ':',
                [
                  'arn:aws:secretsmanager',
                  { Ref: 'AWS::Region' },
                  { Ref: 'AWS::AccountId' },
                  'secret',
                  `google-api-credentials-${envAlias}*`,
                ],
              ],
            },
          },
          {
            Effect: 'Allow',
            Action: 'ses:SendTemplatedEmail',
            Resource: ['*'],
            Condition: {
              StringLike: {
                'ses:FromAddress': '*@asap.science',
              },
            },
          },
          {
            Effect: 'Allow',
            Action: 'events:*',
            Resource: {
              'Fn::Join': [
                ':',
                [
                  'arn:aws:events',
                  { Ref: 'AWS::Region' },
                  { Ref: 'AWS::AccountId' },
                  'event-bus/asap-events-${self:provider.stage}',
                ],
              ],
            },
          },
          {
            Effect: 'Allow',
            Action: ['cloudfront:CreateInvalidation'],
            Resource: ['*'],
          },
          {
            Effect: 'Allow',
            Action: [
              'sqs:SendMessage',
              'sqs:ReceiveMessage',
              'sqs:DeleteMessage',
              'sqs:GetQueueAttributes',
            ],
            Resource: {
              'Fn::GetAtt': ['ContentfulPollerQueue', 'Arn'],
            },
          },
          {
            Effect: 'Allow',
            Action: [
              'sqs:SendMessage',
              'sqs:ReceiveMessage',
              'sqs:DeleteMessage',
              'sqs:GetQueueAttributes',
            ],
            Resource: {
              'Fn::GetAtt': ['InviteUserQueue', 'Arn'],
            },
          },
          {
            Effect: 'Allow',
            Action: [
              'sqs:SendMessage',
              'sqs:ReceiveMessage',
              'sqs:DeleteMessage',
              'sqs:GetQueueAttributes',
            ],
            Resource: {
              'Fn::GetAtt': ['GoogleCalendarEventQueue', 'Arn'],
            },
          },
        ],
      },
    },
  },
  package: {
    individually: true,
    excludeDevDependencies: false,
  },
  custom: {
    apiHostname: new URL(apiUrl).hostname,
    appHostname: new URL(appUrl).hostname,
    s3Sync: [
      {
        bucketName: '${self:service}-${self:provider.stage}-frontend',
        deleteRemoved: false,
        localDir: '../crn-frontend/dist',
      },
      {
        bucketName: '${self:service}-${self:provider.stage}-auth-frontend',
        bucketPrefix: '.auth',
        localDir: '../crn-auth-frontend/dist',
      },
      {
        bucketName: '${self:service}-${self:provider.stage}-storybook',
        bucketPrefix: '.storybook',
        localDir: '../storybook/build',
      },
      {
        bucketName: '${self:service}-${self:provider.stage}-messages-static',
        deleteRemoved: false,
        bucketPrefix: '.messages-static',
        localDir: '../crn-messages/build-templates/static',
      },
    ],
    esbuild: {
      packager: 'yarn',
      platform: 'node',
      target: 'node20',
      bundle: true,
    },
    'serverless-offline-ssm': {
      stages: ['local'],
      ssm: offlineSSM,
    },
    apiGateway5xxTopic:
      '${self:service}-${self:provider.stage}-topic-api-gateway-5xx',
  },
  functions: {
    publicApiHandler: {
      handler: 'src/handlers/public-api-handler.publicApiHandler',
      events: [
        {
          httpApi: {
            method: 'GET',
            path: '/public/{proxy+}',
          },
        },
      ],
      environment: {
        APP_ORIGIN: appUrl,
        SENTRY_DSN: sentryDsnPublicApi,
      },
    },
    apiHandler: {
      handler: './src/handlers/api-handler.apiHandler',
      events: [
        {
          httpApi: {
            method: '*',
            path: '*',
          },
        },
      ],
      environment: {
        SENTRY_DSN: sentryDsnApi,
        AUTH0_AUDIENCE: auth0Audience,
        AUTH0_CLIENT_ID: auth0ClientId,
        OPENAI_API_KEY: openaiApiKey,
        POSTMARK_SERVER_TOKEN: postmarkServerToken,
      },
    },
    auth0FetchByCode: {
      handler: './src/handlers/webhooks/fetch-by-code/handler.handler',
      events: [
        {
          httpApi: {
            method: 'GET',
            path: '/webhook/users/{code}',
          },
        },
      ],
      environment: {
        AUTH0_CLIENT_ID: auth0ClientId,
        AUTH0_SHARED_SECRET: auth0SharedSecret,
        ALGOLIA_API_KEY: `\${ssm:crn-algolia-search-api-key-${envAlias}}`,
        SENTRY_DSN: sentryDsnHandlers,
      },
    },
    auth0ConnectByCode: {
      handler: './src/handlers/webhooks/webhook-connect-by-code.handler',
      events: [
        {
          httpApi: {
            method: 'POST',
            path: '/webhook/users/connections',
          },
        },
      ],
      environment: {
        AUTH0_CLIENT_ID: auth0ClientId,
        AUTH0_SHARED_SECRET: auth0SharedSecret,
        SENTRY_DSN: sentryDsnHandlers,
      },
    },
    gcalSubscribeCalendarContentful: {
      handler: './src/handlers/calendar/gcal-subscribe-handler.handler',
      events: [
        {
          eventBridge: {
            eventBus: 'asap-events-${self:provider.stage}',
            pattern: {
              source: [eventBusSourceContentful],
              'detail-type': [
                'CalendarsPublished',
              ] satisfies WebhookDetailType[],
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
        QUEUE_URL: { Ref: 'InviteUserQueue' },
        SENTRY_DSN: sentryDsnHandlers,
      },
    },
    inviteUserContentful: {
      timeout: 120,
      handler: 'src/handlers/user/invite-handler.sqsHandler',
      events: [
        {
          sqs: {
            arn: { 'Fn::GetAtt': ['InviteUserQueue', 'Arn'] },
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
      handler:
        './src/handlers/event/algolia-index-group-events-handler.handler',
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
    gcalEventsUpdatedContentful: {
      handler: './src/handlers/webhooks/gcal-webhook-events-updated.handler',
      events: [
        {
          httpApi: {
            method: 'POST',
            path: '/webhook/events/contentful',
          },
        },
      ],
      environment: {
        GOOGLE_API_TOKEN: `\${ssm:google-api-token-${envAlias}}`,
        GOOGLE_CALENDER_EVENT_QUEUE_URL: {
          Ref: 'GoogleCalendarEventQueue',
        },
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
            arn: {
              'Fn::GetAtt': ['GoogleCalendarEventQueue', 'Arn'],
            },
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

    invalidateCache: {
      handler: './src/handlers/invalidate-cache/invalidate-handler.handler',
      events: [
        {
          s3: {
            bucket: { Ref: 'FrontendBucket' },
            event: 's3:ObjectCreated:*',
            rules: [
              {
                prefix: 'index',
              },
              {
                suffix: '.html',
              },
            ],
            existing: true,
          },
        },
      ],
      environment: {
        CLOUDFRONT_DISTRIBUTION_ID: {
          Ref: 'CloudFrontDistribution',
        },
        SENTRY_DSN: sentryDsnHandlers,
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
    algoliaIndexTutorials: {
      handler:
        './src/handlers/tutorials/algolia-index-tutorials-handler.handler',
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
    updateContentfulWorkingGroupDeliverables: {
      handler:
        './src/handlers/working-group/update-deliverables-handler.handler',
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
    contentfulWebhook: {
      handler: './src/handlers/webhooks/webhook-contentful.handler',
      events: [
        {
          httpApi: {
            method: 'POST',
            path: '/webhook/contentful',
          },
        },
      ],
      environment: {
        CONTENTFUL_WEBHOOK_AUTHENTICATION_TOKEN:
          contentfulWebhookAuthenticationToken,
        CONTENTFUL_POLLER_QUEUE_URL: {
          Ref: 'ContentfulPollerQueue',
        },
        SENTRY_DSN: sentryDsnHandlers,
      },
    },
    contentfulWebhookPoller: {
      handler: './src/handlers/webhooks/webhook-contentful-poller.handler',
      timeout: 20,
      reservedConcurrency: 2,
      events: [
        {
          sqs: {
            arn: {
              'Fn::GetAtt': ['ContentfulPollerQueue', 'Arn'],
            },
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
    saveCookiePreferences: {
      handler:
        './src/handlers/cookie-preferences/save-cookie-preferences-handler.handler',
      events: [
        {
          httpApi: {
            method: 'POST',
            path: '/cookie-preferences/save',
          },
        },
      ],
      environment: {
        COOKIE_PREFERENCES_TABLE_NAME:
          '${self:service}-${self:provider.stage}-cookie-preferences',
        SENTRY_DSN: sentryDsnHandlers,
      },
    },
    getCookiePreferences: {
      handler:
        './src/handlers/cookie-preferences/get-cookie-preferences-handler.handler',
      events: [
        {
          httpApi: {
            method: 'GET',
            path: '/cookie-preferences/{cookieId}',
          },
        },
      ],
      environment: {
        COOKIE_PREFERENCES_TABLE_NAME:
          '${self:service}-${self:provider.stage}-cookie-preferences',
        SENTRY_DSN: sentryDsnHandlers,
      },
    },
    getPresignedUrl: {
      handler: './src/handlers/files-upload/get-presigned-url-handler.handler',
      environment: {
        FILES_BUCKET: '${self:service}-${self:provider.stage}-files',
        DATA_BACKUP_BUCKET: {
          'Fn::If': [
            'IsProd',
            '${self:service}-${self:provider.stage}-data-backup',
            '${self:service}-dev-data-backup',
          ],
        },
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
    sendSlackAlert: {
      handler: './src/handlers/send-slack-alert.handler',
      events: [
        {
          sns: {
            arn: { Ref: 'TopicCloudwatchAlarm' },
            topicName: '${self:custom.apiGateway5xxTopic}',
          },
        },
      ],
      environment: {
        SLACK_WEBHOOK: slackWebhook,
      },
    },
  },
  resources: {
    Conditions: {
      IsDev: {
        'Fn::Equals': ['${self:provider.stage}', 'dev'],
      },
      IsProd: {
        'Fn::Equals': ['${self:provider.stage}', 'production'],
      },
      IsDevOrProd: {
        'Fn::Or': [
          {
            Condition: 'IsDev',
          },
          {
            Condition: 'IsProd',
          },
        ],
      },
    },
    Resources: {
      HttpApiDomain: {
        Type: 'AWS::ApiGatewayV2::DomainName',
        Properties: {
          DomainName: '${self:custom.apiHostname}',
          DomainNameConfigurations: [
            {
              CertificateArn: awsAcmCertificateArn,
              EndpointType: 'REGIONAL',
            },
          ],
        },
      },
      HttpApiApiMapping: {
        Type: 'AWS::ApiGatewayV2::ApiMapping',
        DependsOn: ['HttpApiDomain'],
        Properties: {
          ApiId: { Ref: 'HttpApi' },
          ApiMappingKey: '',
          DomainName: '${self:custom.apiHostname}',
          Stage: { Ref: 'HttpApiStage' },
        },
      },
      HttpApiRecordSetGroup: {
        Type: 'AWS::Route53::RecordSetGroup',
        Properties: {
          HostedZoneName: `${hostname}.`,
          RecordSets: [
            {
              Name: '${self:custom.apiHostname}',
              Type: 'A',
              AliasTarget: {
                DNSName: {
                  'Fn::GetAtt': ['HttpApiDomain', 'RegionalDomainName'],
                },
                HostedZoneId: {
                  'Fn::GetAtt': ['HttpApiDomain', 'RegionalHostedZoneId'],
                },
              },
            },
          ],
        },
      },
      HttpApiStage: {
        Type: 'AWS::ApiGatewayV2::Stage',
        DependsOn: ['HttpApiRouteGetPublicProxyVar'],
        Properties: {
          RouteSettings: {
            'GET /public/{proxy+}': {
              ThrottlingBurstLimit: 50,
              ThrottlingRateLimit: 30,
            },
          },
        },
      },
      FilesBucket: {
        Type: 'AWS::S3::Bucket',
        DeletionPolicy: 'Delete',
        Properties: {
          BucketName: '${self:service}-${self:provider.stage}-files',
          OwnershipControls: {
            Rules: [
              {
                ObjectOwnership: 'BucketOwnerPreferred',
              },
            ],
          },
          PublicAccessBlockConfiguration: {
            BlockPublicPolicy: false,
            BlockPublicAcls: false,
            IgnorePublicAcls: false,
            RestrictPublicBuckets: false,
          },
          CorsConfiguration: {
            // allows PUT requests from the app frontend
            CorsRules: [
              {
                AllowedOrigins: ['https://${self:custom.appHostname}'],
                AllowedMethods: ['PUT'],
                AllowedHeaders: ['*'],
                ExposedHeaders: ['ETag'],
                MaxAge: 3000,
              },
            ],
          },
          LifecycleConfiguration: {
            Rules: [
              {
                Id: 'AutoDeleteAfter24Hours',
                Status: 'Enabled',
                ExpirationInDays: 1,
              },
            ],
          },
        },
      },
      BucketPolicyFiles: {
        Type: 'AWS::S3::BucketPolicy',
        Properties: {
          Bucket: '${self:service}-${self:provider.stage}-files',
          PolicyDocument: {
            Version: '2012-10-17',
            Statement: [
              {
                Sid: 'AllowPublicRead',
                Effect: 'Allow',
                Principal: '*',
                Action: 's3:GetObject',
                Resource: {
                  'Fn::Join': [
                    '',
                    [
                      'arn:aws:s3:::',
                      '${self:service}-${self:provider.stage}-files',
                      '/*',
                    ],
                  ],
                },
              },
            ],
          },
        },
      },
      FrontendBucket: {
        Type: 'AWS::S3::Bucket',
        DeletionPolicy: 'Delete',
        Properties: {
          BucketName: '${self:service}-${self:provider.stage}-frontend',
          OwnershipControls: {
            Rules: [
              {
                ObjectOwnership: 'BucketOwnerPreferred',
              },
            ],
          },
          PublicAccessBlockConfiguration: {
            BlockPublicPolicy: false,
            BlockPublicAcls: false,
            IgnorePublicAcls: false,
            RestrictPublicBuckets: false,
          },
          CorsConfiguration: {
            CorsRules: [
              {
                AllowedMethods: ['GET', 'HEAD'],
                AllowedHeaders: ['*'],
                AllowedOrigins: ['*'],
                MaxAge: 3000,
              },
            ],
          },
        },
      },
      AuthFrontendBucket: {
        Type: 'AWS::S3::Bucket',
        DeletionPolicy: 'Delete',
        Properties: {
          BucketName: '${self:service}-${self:provider.stage}-auth-frontend',
          OwnershipControls: {
            Rules: [
              {
                ObjectOwnership: 'BucketOwnerPreferred',
              },
            ],
          },
          PublicAccessBlockConfiguration: {
            BlockPublicPolicy: false,
            BlockPublicAcls: false,
            IgnorePublicAcls: false,
            RestrictPublicBuckets: false,
          },
          CorsConfiguration: {
            CorsRules: [
              {
                AllowedMethods: ['GET', 'HEAD'],
                AllowedHeaders: ['*'],
                AllowedOrigins: ['*'],
                MaxAge: 3000,
              },
            ],
          },
        },
      },
      StorybookBucket: {
        Type: 'AWS::S3::Bucket',
        DeletionPolicy: 'Delete',
        Properties: {
          BucketName: '${self:service}-${self:provider.stage}-storybook',
          OwnershipControls: {
            Rules: [
              {
                ObjectOwnership: 'BucketOwnerPreferred',
              },
            ],
          },
          PublicAccessBlockConfiguration: {
            BlockPublicPolicy: false,
            BlockPublicAcls: false,
            IgnorePublicAcls: false,
            RestrictPublicBuckets: false,
          },
          CorsConfiguration: {
            CorsRules: [
              {
                AllowedMethods: ['GET', 'HEAD'],
                AllowedHeaders: ['*'],
                AllowedOrigins: ['*'],
                MaxAge: 3000,
              },
            ],
          },
          WebsiteConfiguration: {
            IndexDocument: 'index.html',
          },
        },
      },
      MessagesStaticBucket: {
        Type: 'AWS::S3::Bucket',
        DeletionPolicy: 'Delete',
        Properties: {
          BucketName: '${self:service}-${self:provider.stage}-messages-static',
          OwnershipControls: {
            Rules: [
              {
                ObjectOwnership: 'BucketOwnerPreferred',
              },
            ],
          },
          PublicAccessBlockConfiguration: {
            BlockPublicPolicy: false,
            BlockPublicAcls: false,
            IgnorePublicAcls: false,
            RestrictPublicBuckets: false,
          },
          CorsConfiguration: {
            CorsRules: [
              {
                AllowedMethods: ['GET', 'HEAD'],
                AllowedHeaders: ['*'],
                AllowedOrigins: ['*'],
                MaxAge: 3000,
              },
            ],
          },
        },
      },
      BucketPolicyFrontend: {
        Type: 'AWS::S3::BucketPolicy',
        Properties: {
          Bucket: '${self:service}-${self:provider.stage}-frontend',
          PolicyDocument: {
            Statement: [
              {
                Action: ['s3:GetObject'],
                Effect: 'Allow',
                Principal: '*',
                Resource: {
                  'Fn::Join': [
                    '',
                    [{ 'Fn::GetAtt': ['FrontendBucket', 'Arn'] }, '/*'],
                  ],
                },
              },
              {
                Action: ['s3:ListBucket'],
                Effect: 'Allow',
                Principal: '*',
                Resource: { 'Fn::GetAtt': ['FrontendBucket', 'Arn'] },
              },
            ],
          },
        },
      },
      BucketPolicyAuthFrontend: {
        Type: 'AWS::S3::BucketPolicy',
        Properties: {
          Bucket: '${self:service}-${self:provider.stage}-auth-frontend',
          PolicyDocument: {
            Statement: [
              {
                Action: ['s3:GetObject'],
                Effect: 'Allow',
                Principal: '*',
                Resource: {
                  'Fn::Join': [
                    '',
                    [{ 'Fn::GetAtt': ['AuthFrontendBucket', 'Arn'] }, '/*'],
                  ],
                },
              },
              {
                Action: ['s3:ListBucket'],
                Effect: 'Allow',
                Principal: '*',
                Resource: { 'Fn::GetAtt': ['AuthFrontendBucket', 'Arn'] },
              },
            ],
          },
        },
      },
      BucketPolicyStorybook: {
        Type: 'AWS::S3::BucketPolicy',
        Properties: {
          Bucket: '${self:service}-${self:provider.stage}-storybook',
          PolicyDocument: {
            Statement: [
              {
                Action: ['s3:GetObject'],
                Effect: 'Allow',
                Principal: '*',
                Resource: {
                  'Fn::Join': [
                    '',
                    [{ 'Fn::GetAtt': ['StorybookBucket', 'Arn'] }, '/*'],
                  ],
                },
              },
              {
                Action: ['s3:ListBucket'],
                Effect: 'Allow',
                Principal: '*',
                Resource: { 'Fn::GetAtt': ['StorybookBucket', 'Arn'] },
              },
            ],
          },
        },
      },
      BucketPolicyMessagesStatic: {
        Type: 'AWS::S3::BucketPolicy',
        Properties: {
          Bucket: '${self:service}-${self:provider.stage}-messages-static',
          PolicyDocument: {
            Statement: [
              {
                Action: ['s3:GetObject'],
                Effect: 'Allow',
                Principal: '*',
                Resource: {
                  'Fn::Join': [
                    '',
                    [{ 'Fn::GetAtt': ['MessagesStaticBucket', 'Arn'] }, '/*'],
                  ],
                },
              },
              {
                Action: ['s3:ListBucket'],
                Effect: 'Allow',
                Principal: '*',
                Resource: { 'Fn::GetAtt': ['MessagesStaticBucket', 'Arn'] },
              },
            ],
          },
        },
      },
      DataBackupBucket: {
        Type: 'AWS::S3::Bucket',
        Condition: 'IsDevOrProd',
        DeletionPolicy: 'Retain',
        Properties: {
          BucketName: '${self:service}-${self:provider.stage}-data-backup',
          LifecycleConfiguration: {
            Rules: [
              {
                Id: 'delete-after-3-months',
                Status: 'Enabled',
                ExpirationInDays: 90,
              },
            ],
          },
        },
      },
      ContentfulBackupBucket: {
        Type: 'AWS::S3::Bucket',
        Condition: 'IsDevOrProd',
        DeletionPolicy: 'Retain',
        Properties: {
          BucketName:
            '${self:service}-${self:provider.stage}-contentful-backup',
          LifecycleConfiguration: {
            Rules: [
              {
                Id: 'delete-after-3-months',
                Status: 'Enabled',
                ExpirationInDays: 90,
              },
            ],
          },
        },
      },
      CloudFrontOriginAccessIdentityFrontend: {
        Type: 'AWS::CloudFront::CloudFrontOriginAccessIdentity',
        Properties: {
          CloudFrontOriginAccessIdentityConfig: {
            Comment: { Ref: 'FrontendBucket' },
          },
        },
      },
      CloudFrontOriginAccessIdentityAuthFrontend: {
        Type: 'AWS::CloudFront::CloudFrontOriginAccessIdentity',
        Properties: {
          CloudFrontOriginAccessIdentityConfig: {
            Comment: { Ref: 'AuthFrontendBucket' },
          },
        },
      },
      CloudFrontOriginAccessIdentityStorybook: {
        Type: 'AWS::CloudFront::CloudFrontOriginAccessIdentity',
        Properties: {
          CloudFrontOriginAccessIdentityConfig: {
            Comment: { Ref: 'StorybookBucket' },
          },
        },
      },
      CloudFrontOriginAccessIdentityMessagesStatic: {
        Type: 'AWS::CloudFront::CloudFrontOriginAccessIdentity',
        Properties: {
          CloudFrontOriginAccessIdentityConfig: {
            Comment: { Ref: 'MessagesStaticBucket' },
          },
        },
      },
      CloudFrontDistribution: {
        Type: 'AWS::CloudFront::Distribution',
        DependsOn: [
          'FrontendBucket',
          'AuthFrontendBucket',
          'StorybookBucket',
          'MessagesStaticBucket',
        ],
        Properties: {
          DistributionConfig: {
            Aliases: ['${self:custom.appHostname}'],
            CustomErrorResponses: [
              {
                ErrorCode: 404,
                ResponseCode: 200,
                ResponsePagePath: '/index.html',
              },
            ],
            Origins: [
              {
                DomainName: {
                  'Fn::GetAtt': ['FrontendBucket', 'RegionalDomainName'],
                },
                Id: 's3origin-frontend',
                S3OriginConfig: {
                  OriginAccessIdentity: {
                    'Fn::Join': [
                      '/',
                      [
                        'origin-access-identity/cloudfront',
                        { Ref: 'CloudFrontOriginAccessIdentityFrontend' },
                      ],
                    ],
                  },
                },
              },
              {
                DomainName: {
                  'Fn::GetAtt': ['AuthFrontendBucket', 'RegionalDomainName'],
                },
                Id: 's3origin-auth-frontend',
                S3OriginConfig: {
                  OriginAccessIdentity: {
                    'Fn::Join': [
                      '/',
                      [
                        'origin-access-identity/cloudfront',
                        { Ref: 'CloudFrontOriginAccessIdentityAuthFrontend' },
                      ],
                    ],
                  },
                },
              },
              {
                CustomOriginConfig: {
                  OriginProtocolPolicy: 'http-only',
                },
                DomainName: {
                  'Fn::Select': [
                    '1',
                    {
                      'Fn::Split': [
                        'http://',
                        {
                          'Fn::GetAtt': ['StorybookBucket', 'WebsiteURL'],
                        },
                      ],
                    },
                  ],
                },
                Id: 's3origin-storybook',
              },
              {
                DomainName: {
                  'Fn::GetAtt': ['MessagesStaticBucket', 'RegionalDomainName'],
                },
                Id: 's3origin-messages-static',
                S3OriginConfig: {
                  OriginAccessIdentity: {
                    'Fn::Join': [
                      '/',
                      [
                        'origin-access-identity/cloudfront',
                        { Ref: 'CloudFrontOriginAccessIdentityAuthFrontend' },
                      ],
                    ],
                  },
                },
              },
              {
                CustomOriginConfig: {
                  OriginProtocolPolicy: 'https-only',
                },
                DomainName: {
                  'Fn::Join': [
                    '.',
                    [
                      { Ref: 'HttpApi' },
                      'execute-api',
                      { Ref: 'AWS::Region' },
                      { Ref: 'AWS::URLSuffix' },
                    ],
                  ],
                },
                Id: 'apigw',
              },
            ],
            DefaultCacheBehavior: {
              AllowedMethods: ['GET', 'HEAD', 'OPTIONS'],
              CachedMethods: ['GET', 'HEAD', 'OPTIONS'],
              Compress: true,
              DefaultTTL: 3600,
              ForwardedValues: {
                Cookies: {
                  Forward: 'none',
                },
                QueryString: false,
              },
              TargetOriginId: 's3origin-frontend',
              ViewerProtocolPolicy: 'redirect-to-https',
            },
            CacheBehaviors: [
              {
                AllowedMethods: ['GET', 'HEAD', 'OPTIONS'],
                CachedMethods: ['GET', 'HEAD', 'OPTIONS'],
                Compress: true,
                DefaultTTL: 3600,
                ForwardedValues: {
                  Cookies: {
                    Forward: 'none',
                  },
                  QueryString: false,
                },
                PathPattern: '.auth/*',
                TargetOriginId: 's3origin-auth-frontend',
                ViewerProtocolPolicy: 'redirect-to-https',
              },
              {
                AllowedMethods: ['GET', 'HEAD', 'OPTIONS'],
                CachedMethods: ['GET', 'HEAD', 'OPTIONS'],
                Compress: true,
                DefaultTTL: 3600,
                ForwardedValues: {
                  Cookies: {
                    Forward: 'none',
                  },
                  QueryString: true,
                },
                PathPattern: '.storybook/*',
                TargetOriginId: 's3origin-storybook',
                ViewerProtocolPolicy: 'redirect-to-https',
              },
              {
                AllowedMethods: ['GET', 'HEAD', 'OPTIONS'],
                CachedMethods: ['GET', 'HEAD', 'OPTIONS'],
                Compress: true,
                DefaultTTL: 3600,
                ForwardedValues: {
                  Cookies: {
                    Forward: 'none',
                  },
                  QueryString: false,
                },
                PathPattern: '.messages-static/*',
                TargetOriginId: 's3origin-messages-static',
                ViewerProtocolPolicy: 'redirect-to-https',
              },
            ],
            DefaultRootObject: 'index.html',
            Enabled: true,
            PriceClass: 'PriceClass_100',
            ViewerCertificate: {
              AcmCertificateArn: awsAcmCertificateArn,
              MinimumProtocolVersion: 'TLSv1.2_2018',
              SslSupportMethod: 'sni-only',
            },
          },
        },
      },
      CloudFrontRecordSetGroup: {
        Type: 'AWS::Route53::RecordSetGroup',
        Properties: {
          HostedZoneName: `${hostname}.`,
          RecordSets: [
            {
              Name: '${self:custom.appHostname}',
              Type: 'A',
              AliasTarget: {
                DNSName: {
                  'Fn::GetAtt': ['CloudFrontDistribution', 'DomainName'],
                },
                // https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-route53-aliastarget.html#cfn-route53-aliastarget-hostedzoneid
                HostedZoneId: 'Z2FDTNDATAQYW2',
              },
            },
          ],
        },
      },
      SubscribeCalendarContentfulDLQ: {
        Type: 'AWS::SQS::Queue',
        Properties: {
          MessageRetentionPeriod: 1_209_600, // 14 days
          QueueName:
            '${self:service}-${self:provider.stage}-subscribe-calendar-contentful-dlq',
        },
      },
      SubscribeCalendarContentfulDLQPolicy: {
        Type: 'AWS::SQS::QueuePolicy',
        Properties: {
          PolicyDocument: {
            Id: '${self:service}-${self:provider.stage}-subscribe-calendar-contentful-dlq-policy',
            Version: '2012-10-17',
            Statement: [
              {
                Sid: 'Publisher-statement-id',
                Effect: 'Allow',
                Principal: {
                  AWS: '*',
                },
                Action: 'sqs:SendMessage',
                Resource: {
                  'Fn::GetAtt': [`SubscribeCalendarContentfulDLQ`, 'Arn'],
                },
              },
            ],
          },
          Queues: [
            {
              Ref: `SubscribeCalendarContentfulDLQ`,
            },
          ],
        },
      },
      ContentfulPollerQueue: {
        Type: 'AWS::SQS::Queue',
        Properties: {
          QueueName:
            '${self:service}-${self:provider.stage}-contentful-poller-queue',
          RedrivePolicy: {
            maxReceiveCount: 5,
            deadLetterTargetArn: {
              'Fn::GetAtt': ['ContentfulPollerQueueDLQ', 'Arn'],
            },
          },
        },
      },
      ContentfulPollerQueueDLQ: {
        Type: 'AWS::SQS::Queue',
        Properties: {
          QueueName:
            '${self:service}-${self:provider.stage}-contentful-poller-queue-dlq',
        },
      },
      GoogleCalendarEventQueue: {
        Type: 'AWS::SQS::Queue',
        Properties: {
          QueueName:
            '${self:service}-${self:provider.stage}-google-calendar-event-queue',
          VisibilityTimeout: 300,
          RedrivePolicy: {
            maxReceiveCount: 5,
            deadLetterTargetArn: {
              'Fn::GetAtt': ['ContentfulPollerQueueDLQ', 'Arn'],
            },
          },
        },
      },
      GoogleCalendarEventQueueDLQ: {
        Type: 'AWS::SQS::Queue',
        Properties: {
          QueueName:
            '${self:service}-${self:provider.stage}-google-calendar-event-queue-dlq',
        },
      },
      ApiGatewayAlarm5xx: {
        Type: 'AWS::CloudWatch::Alarm',
        Properties: {
          AlarmDescription: '5xx errors detected at API Gateway',
          Namespace: 'AWS/ApiGateway',
          MetricName: '5xx',
          Statistic: 'Sum',
          Threshold: 0,
          ComparisonOperator: 'GreaterThanThreshold',
          EvaluationPeriods: 1,
          Period: 60,
          AlarmActions: [{ Ref: 'TopicCloudwatchAlarm' }],
          TreatMissingData: 'notBreaching',
          Dimensions: [
            {
              Name: 'ApiId',
              Value: {
                Ref: 'HttpApi',
              },
            },
            {
              Name: 'Stage',
              Value: {
                Ref: 'HttpApiStage',
              },
            },
          ],
        },
      },
      TopicCloudwatchAlarm: {
        Type: 'AWS::SNS::Topic',
        Properties: {
          TopicName: '${self:custom.apiGateway5xxTopic}',
        },
      },
      CookiePreferencesDynamoDbTable: {
        Type: 'AWS::DynamoDB::Table',
        Properties: {
          TableName:
            '${self:service}-${self:provider.stage}-cookie-preferences',
          AttributeDefinitions: [
            {
              AttributeName: 'cookieId',
              AttributeType: 'S',
            },
          ],
          KeySchema: [
            {
              AttributeName: 'cookieId',
              KeyType: 'HASH',
            },
          ],
          BillingMode: 'PAY_PER_REQUEST',
        },
      },
      InviteUserQueue: {
        Type: 'AWS::SQS::Queue',
        Properties: {
          QueueName: '${self:service}-${self:provider.stage}-invite-user-queue',
          VisibilityTimeout: 120, // Matches lambda timeout
          RedrivePolicy: {
            maxReceiveCount: 5,
            deadLetterTargetArn: {
              'Fn::GetAtt': ['InviteUserQueueDLQ', 'Arn'],
            },
          },
        },
      },
      InviteUserQueueDLQ: {
        Type: 'AWS::SQS::Queue',
        Properties: {
          QueueName:
            '${self:service}-${self:provider.stage}-invite-user-queue-dlq',
          MessageRetentionPeriod: 1209600, // 14 days
        },
      },
    },
    extensions: {
      GcalSubscribeCalendarContentfulLambdaFunction: {
        Properties: {
          DeadLetterConfig: {
            TargetArn: {
              'Fn::GetAtt': ['SubscribeCalendarContentfulDLQ', 'Arn'],
            },
          },
        },
      },
    },
  },
};

module.exports = serverlessConfig;
