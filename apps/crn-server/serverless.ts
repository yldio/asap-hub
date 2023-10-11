import { WebhookDetailType } from '@asap-hub/model';
import { AWS } from '@serverless/typescript';
import assert from 'assert';

const { NODE_ENV = 'development' } = process.env;

if (NODE_ENV === 'production') {
  [
    'CRN_API_URL',
    'CRN_APP_URL',
    'CRN_AWS_ACM_CERTIFICATE_ARN',
    'CRN_AUTH0_AUDIENCE',
    'CRN_AUTH0_CLIENT_ID',
    'CRN_SENTRY_DSN_API',
    'CRN_SENTRY_DSN_HANDLERS',
    'CRN_SES_REGION',
    'CRN_CONTENTFUL_ENV',
    'CRN_CONTENTFUL_ACCESS_TOKEN',
    'CRN_CONTENTFUL_PREVIEW_ACCESS_TOKEN',
    'CRN_CONTENTFUL_MANAGEMENT_ACCESS_TOKEN',
    'CRN_CONTENTFUL_SPACE_ID',
    'CRN_CONTENTFUL_WEBHOOK_AUTHENTICATION_TOKEN',
  ].forEach((env) => {
    assert.ok(process.env[env], `${env} not defined`);
  });
}

const {
  CRN_APP_URL = 'http://localhost:3000',
  CRN_API_URL = 'http://localhost:3333',
  ASAP_HOSTNAME = 'hub.asap.science',
  CRN_AWS_ACM_CERTIFICATE_ARN,
  SLS_STAGE = 'development',
  CI_COMMIT_SHA,
  CRN_ALGOLIA_INDEX,
  CRN_SENTRY_DSN_API,
  CRN_SENTRY_DSN_HANDLERS,
  CRN_SES_REGION,
  CRN_AUTH0_AUDIENCE,
  CRN_AUTH0_CLIENT_ID,
  CRN_CONTENTFUL_ENV,
  CRN_CONTENTFUL_ACCESS_TOKEN,
  CRN_CONTENTFUL_PREVIEW_ACCESS_TOKEN,
  CRN_CONTENTFUL_MANAGEMENT_ACCESS_TOKEN,
  CRN_CONTENTFUL_SPACE_ID,
  CRN_CONTENTFUL_WEBHOOK_AUTHENTICATION_TOKEN,
  LOG_LEVEL,
  SLACK_WEBHOOK,
} = process.env;

const region = process.env.AWS_REGION as AWS['provider']['region'];
const envAlias = SLS_STAGE === 'production' ? 'prod' : 'dev';
const envRef =
  SLS_STAGE === 'production'
    ? 'prod'
    : SLS_STAGE === 'dev'
    ? 'dev'
    : `CI-${SLS_STAGE}`;
const sentryDsnApi = CRN_SENTRY_DSN_API!;
const sentryDsnHandlers = CRN_SENTRY_DSN_HANDLERS!;
const auth0ClientId = CRN_AUTH0_CLIENT_ID!;
const auth0Audience = CRN_AUTH0_AUDIENCE!;
const contentfulEnvironment = CRN_CONTENTFUL_ENV!;
const contentfulAccessToken = CRN_CONTENTFUL_ACCESS_TOKEN!;
const contentfulPreviewAccessToken = CRN_CONTENTFUL_PREVIEW_ACCESS_TOKEN!;
const contentfulManagementAccessToken = CRN_CONTENTFUL_MANAGEMENT_ACCESS_TOKEN!;
const contentfulWebhookAuthenticationToken =
  CRN_CONTENTFUL_WEBHOOK_AUTHENTICATION_TOKEN!;
const contentfulSpaceId = CRN_CONTENTFUL_SPACE_ID!;
const sesRegion = CRN_SES_REGION!;

const algoliaIndex = CRN_ALGOLIA_INDEX
  ? '${env:CRN_ALGOLIA_INDEX}'
  : `asap-hub_${envRef}`;
const service = 'asap-hub';

export const plugins = [
  './serverless-plugins/serverless-s3-sync',
  './serverless-plugins/serverless-iam-roles-per-function',
  './serverless-plugins/serverless-webpack',
];
const offlinePlugins = [
  './serverless-plugins/serverless-offline',
  './serverless-plugins/serverless-offline-ssm',
  './serverless-plugins/serverless-offline-aws-eventbridge',
];

const offlineSSM =
  SLS_STAGE === 'local'
    ? {
        'algolia-app-id-dev': '${env:ALGOLIA_APP_ID}',
        'algolia-index-api-key-dev': '${env:ALGOLIA_API_KEY}',
        'algolia-search-api-key-dev': '${env:ALGOLIA_API_KEY}',
        'crn-algolia-app-id-dev': '${env:ALGOLIA_APP_ID}',
        'crn-algolia-index-api-key-dev': '${env:ALGOLIA_API_KEY}',
        'crn-algolia-search-api-key-dev': '${env:ALGOLIA_API_KEY}',
        'auth0-shared-secret-dev': '${env:AUTH0_SHARED_SECRET}',
        'google-api-token-dev': '${env:GOOGLE_API_TOKEN}',
        'ses-region-dev': '${env:SES_REGION}',
        'email-invite-sender-dev': '${env:EMAIL_SENDER}',
        'email-invite-bcc-dev': '${env:EMAIL_BCC}',
        'email-invite-return-dev': '${env:EMAIL_RETURN}',
      }
    : {};

if (SLS_STAGE === 'local') {
  plugins.push(...offlinePlugins);
}

const eventBusSourceContentful = 'asap.contentful';

const serverlessConfig: AWS = {
  service,
  plugins,
  provider: {
    name: 'aws',
    runtime: 'nodejs18.x',
    architecture: 'arm64',
    timeout: 16,
    memorySize: 1024,
    region,
    stage: SLS_STAGE,
    versionFunctions: false,
    httpApi: {
      payload: '2.0',
      cors: {
        allowedOrigins: [CRN_APP_URL],
        allowCredentials: true,
        allowedMethods: ['OPTIONS', 'POST', 'GET', 'PUT', 'DELETE', 'PATCH'],
        allowedHeaders: [
          'authorization',
          'x-transaction-id',
          'x-contentful-enabled',
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
      APP_ORIGIN: CRN_APP_URL,
      DEBUG: SLS_STAGE === 'production' ? '' : 'crn-server,http',
      NODE_ENV: '${env:NODE_ENV}',
      ENVIRONMENT: '${env:SLS_STAGE}',
      REGION: '${env:AWS_REGION}',
      CRN_API_URL: '${env:CRN_API_URL}',
      LOG_LEVEL: LOG_LEVEL || (SLS_STAGE === 'production' ? 'error' : 'info'),
      NODE_OPTIONS: '--enable-source-maps',
      ALGOLIA_APP_ID: `\${ssm:crn-algolia-app-id-${envAlias}}`,
      CURRENT_REVISION: CI_COMMIT_SHA || '${env:CURRENT_REVISION}',
      IS_CONTENTFUL_ENABLED: 'true',
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
        ],
      },
    },
  },
  package: {
    individually: true,
    excludeDevDependencies: false,
  },
  custom: {
    apiHostname: new URL(CRN_API_URL).hostname,
    appHostname: new URL(CRN_APP_URL).hostname,
    s3Sync: [
      {
        bucketName: '${self:service}-${self:provider.stage}-frontend',
        deleteRemoved: false,
        localDir: '../crn-frontend/build',
      },
      {
        bucketName: '${self:service}-${self:provider.stage}-auth-frontend',
        bucketPrefix: '.auth',
        localDir: '../crn-auth-frontend/build',
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
    webpack: {
      config: './webpack.config.js',
    },
    'serverless-offline-ssm': {
      stages: ['local'],
      ssm: offlineSSM,
    },
    apiGateway5xxTopic:
      '${self:service}-${self:provider.stage}-topic-api-gateway-5xx',
  },
  functions: {
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
        AUTH0_SHARED_SECRET: `\${ssm:auth0-shared-secret-${envAlias}}`,
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
        AUTH0_SHARED_SECRET: `\${ssm:auth0-shared-secret-${envAlias}}`,
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
              'detail-type': ['CalendarsPublished'],
            },
          },
        },
      ],
      environment: {
        GOOGLE_API_CREDENTIALS_SECRET_ID: `google-api-credentials-${envAlias}`,
        GOOGLE_API_TOKEN: `\${ssm:google-api-token-${envAlias}}`,
        SENTRY_DSN: sentryDsnHandlers,
        IS_CONTENTFUL_ENABLED: 'true',
      },
    },
    gcalResubscribeCalendarsContentful: {
      handler: './src/handlers/calendar/gcal-resubscribe-handler.handler',
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
        IS_CONTENTFUL_ENABLED: 'true',
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
              'detail-type': ['UsersPublished'],
            },
            retryPolicy: {
              maximumRetryAttempts: 2,
            },
          },
        },
      ],
      environment: {
        SENTRY_DSN: sentryDsnHandlers,
        IS_CONTENTFUL_ENABLED: 'true',
      },
    },
    inviteUserContentful: {
      timeout: 120,
      handler: './src/handlers/user/invite-handler.handler',
      events: [
        {
          eventBridge: {
            eventBus: 'asap-events-${self:provider.stage}',
            pattern: {
              source: [eventBusSourceContentful],
              'detail-type': ['UsersPublished'],
            },
            retryPolicy: {
              maximumRetryAttempts: 2,
            },
          },
        },
      ],
      environment: {
        SES_REGION: sesRegion,
        EMAIL_SENDER: `\${ssm:email-invite-sender-${envAlias}}`,
        EMAIL_BCC: `\${ssm:email-invite-bcc-${envAlias}}`,
        EMAIL_RETURN: `\${ssm:email-invite-return-${envAlias}}`,
        SENTRY_DSN: sentryDsnHandlers,
        IS_CONTENTFUL_ENABLED: 'true',
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
                'ResearchOutputsUpdated',
                'ResearchOutputsUnpublished',
                'ResearchOutputsDeleted',
              ] satisfies WebhookDetailType[],
            },
          },
        },
      ],
      environment: {
        ALGOLIA_API_KEY: `\${ssm:crn-algolia-index-api-key-${envAlias}}`,
        ALGOLIA_INDEX: `${algoliaIndex}`,
        SENTRY_DSN: sentryDsnHandlers,
        IS_CONTENTFUL_ENABLED: 'true',
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
                'UsersUpdated',
                'UsersCreated',
                'UsersUnpublished',
                'UsersDeleted',
              ] satisfies WebhookDetailType[],
            },
          },
        },
      ],
      environment: {
        ALGOLIA_API_KEY: `\${ssm:crn-algolia-index-api-key-${envAlias}}`,
        ALGOLIA_INDEX: `${algoliaIndex}`,
        SENTRY_DSN: sentryDsnHandlers,
        IS_CONTENTFUL_ENABLED: 'true',
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
                'ExternalAuthorsUpdated',
                'ExternalAuthorsUnpublished',
                'ExternalAuthorsDeleted',
              ] satisfies WebhookDetailType[],
            },
          },
        },
      ],
      environment: {
        ALGOLIA_API_KEY: `\${ssm:crn-algolia-index-api-key-${envAlias}}`,
        ALGOLIA_INDEX: `${algoliaIndex}`,
        SENTRY_DSN: sentryDsnHandlers,
        IS_CONTENTFUL_ENABLED: 'true',
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
                'EventsDeleted',
              ] satisfies WebhookDetailType[],
            },
          },
        },
      ],
      environment: {
        ALGOLIA_API_KEY: `\${ssm:crn-algolia-index-api-key-${envAlias}}`,
        ALGOLIA_INDEX: `${algoliaIndex}`,
        SENTRY_DSN: sentryDsnHandlers,
        IS_CONTENTFUL_ENABLED: 'true',
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
                'UsersUpdated',
                'UsersUnpublished',
                'UsersDeleted',
              ] satisfies WebhookDetailType[],
            },
          },
        },
      ],
      environment: {
        ALGOLIA_API_KEY: `\${ssm:crn-algolia-index-api-key-${envAlias}}`,
        ALGOLIA_INDEX: `${algoliaIndex}`,
        SENTRY_DSN: sentryDsnHandlers,
        IS_CONTENTFUL_ENABLED: 'true',
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
                'ExternalAuthorsUpdated',
                'ExternalAuthorsUnpublished',
                'ExternalAuthorsDeleted',
              ] satisfies WebhookDetailType[],
            },
          },
        },
      ],
      environment: {
        ALGOLIA_API_KEY: `\${ssm:crn-algolia-index-api-key-${envAlias}}`,
        ALGOLIA_INDEX: `${algoliaIndex}`,
        SENTRY_DSN: sentryDsnHandlers,
        IS_CONTENTFUL_ENABLED: 'true',
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
                'TeamsUpdated',
                'TeamsUnpublished',
                'TeamsDeleted',
              ] satisfies WebhookDetailType[],
            },
          },
        },
      ],
      environment: {
        ALGOLIA_API_KEY: `\${ssm:crn-algolia-index-api-key-${envAlias}}`,
        ALGOLIA_INDEX: `${algoliaIndex}`,
        SENTRY_DSN: sentryDsnHandlers,
        IS_CONTENTFUL_ENABLED: 'true',
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
                'InterestGroupsUpdated',
                'InterestGroupsUnpublished',
                'InterestGroupsDeleted',
              ] satisfies WebhookDetailType[],
            },
          },
        },
      ],
      environment: {
        ALGOLIA_API_KEY: `\${ssm:crn-algolia-index-api-key-${envAlias}}`,
        ALGOLIA_INDEX: `${algoliaIndex}`,
        SENTRY_DSN: sentryDsnHandlers,
        IS_CONTENTFUL_ENABLED: 'true',
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
                'LabsUpdated',
                'LabsUnpublished',
                'LabsDeleted',
              ] satisfies WebhookDetailType[],
            },
          },
        },
      ],
      environment: {
        ALGOLIA_API_KEY: `\${ssm:crn-algolia-index-api-key-${envAlias}}`,
        ALGOLIA_INDEX: `${algoliaIndex}`,
        SENTRY_DSN: sentryDsnHandlers,
        IS_CONTENTFUL_ENABLED: 'true',
      },
    },
    gcalEventsUpdatedContentful: {
      timeout: 300,
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
        GOOGLE_API_CREDENTIALS_SECRET_ID: `google-api-credentials-${envAlias}`,
        GOOGLE_API_TOKEN: `\${ssm:google-api-token-${envAlias}}`,
        SENTRY_DSN: sentryDsnHandlers,
        IS_CONTENTFUL_ENABLED: 'true',
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
    algoliaIndexTeamResearchOutputs: {
      handler:
        './src/handlers/teams/algolia-index-team-research-outputs-handler.handler',
      events: [
        {
          eventBridge: {
            eventBus: 'asap-events-${self:provider.stage}',
            pattern: {
              source: [eventBusSourceContentful],
              'detail-type': ['TeamsPublished', 'TeamsUpdated', 'TeamsDeleted'],
            },
          },
        },
      ],
      environment: {
        ALGOLIA_API_KEY: `\${ssm:crn-algolia-index-api-key-${envAlias}}`,
        ALGOLIA_INDEX: `${algoliaIndex}`,
        SENTRY_DSN: sentryDsnHandlers,
        IS_CONTENTFUL_ENABLED: 'true',
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
              'detail-type': ['TeamsPublished', 'TeamsUpdated', 'TeamsDeleted'],
            },
          },
        },
      ],
      environment: {
        ALGOLIA_API_KEY: `\${ssm:crn-algolia-index-api-key-${envAlias}}`,
        ALGOLIA_INDEX: `${algoliaIndex}`,
        SENTRY_DSN: sentryDsnHandlers,
        IS_CONTENTFUL_ENABLED: 'true',
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
              'detail-type': ['WorkingGroupsPublished'],
            },
          },
        },
      ],
      environment: {
        SENTRY_DSN: sentryDsnHandlers,
        IS_CONTENTFUL_ENABLED: 'true',
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
        EVENT_BUS: 'asap-events-${self:provider.stage}',
        EVENT_SOURCE: eventBusSourceContentful,
        SENTRY_DSN: sentryDsnHandlers,
        CONTENTFUL_WEBHOOK_AUTHENTICATION_TOKEN:
          contentfulWebhookAuthenticationToken,
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
        IS_CONTENTFUL_ENABLED: 'true',
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
        SLACK_WEBHOOK: SLACK_WEBHOOK!,
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
              CertificateArn: CRN_AWS_ACM_CERTIFICATE_ARN,
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
          HostedZoneName: `${ASAP_HOSTNAME}.`,
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
              AcmCertificateArn: CRN_AWS_ACM_CERTIFICATE_ARN,
              MinimumProtocolVersion: 'TLSv1.2_2018',
              SslSupportMethod: 'sni-only',
            },
          },
        },
      },
      CloudFrontRecordSetGroup: {
        Type: 'AWS::Route53::RecordSetGroup',
        Properties: {
          HostedZoneName: `${ASAP_HOSTNAME}.`,
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
