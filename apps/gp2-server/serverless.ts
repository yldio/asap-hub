import { gp2 } from '@asap-hub/model';
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
  'SES_REGION',
  'SLS_STAGE',
].forEach((env) => {
  assert.ok(process.env[env], `${env} not defined`);
});

const stage = process.env.SLS_STAGE!;
assert.ok(
  stage === 'dev' || stage === 'production' || !isNaN(Number.parseInt(stage)),
  'SLS_STAGE must be either "dev" or "production" or a PR number',
);

const activeCampaignAccount = process.env.ACTIVE_CAMPAIGN_ACCOUNT || '';
const activeCampaignToken = process.env.ACTIVE_CAMPAIGN_TOKEN!;
const auth0Audience = process.env.AUTH0_AUDIENCE!;
const auth0ClientId = process.env.AUTH0_CLIENT_ID!;
const auth0SharedSecret = process.env.AUTH0_SHARED_SECRET!;
const gp2AwsAcmCertificateArn = process.env.AWS_ACM_CERTIFICATE_ARN!;
const hostname = process.env.HOSTNAME!;
const region = process.env.AWS_REGION as AWS['provider']['region'];
const contentfulEnvironment = process.env.CONTENTFUL_ENV!;
const contentfulAccessToken = process.env.CONTENTFUL_ACCESS_TOKEN!;
const contentfulPreviewAccessToken =
  process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN!;
const contentfulManagementAccessToken =
  process.env.CONTENTFUL_MANAGEMENT_ACCESS_TOKEN!;
const contentfulSpaceId = process.env.CONTENTFUL_SPACE_ID!;
const contentfulWebhookAuthenticationToken =
  process.env.CONTENTFUL_WEBHOOK_AUTHENTICATION_TOKEN!;
const openaiApiKey = process.env.OPENAI_API_KEY!;

if (stage === 'dev' || stage === 'production') {
  ['SENTRY_DSN_API', 'SENTRY_DSN_PUBLIC_API', 'SENTRY_DSN_HANDLERS'].forEach(
    (env) => {
      assert.ok(process.env[env], `${env} not defined`);
    },
  );
}

const sentryDsnApi = process.env.SENTRY_DSN_API!;
const sentryDsnPublicApi = process.env.SENTRY_DSN_PUBLIC_API!;
const sentryDsnHandlers = process.env.SENTRY_DSN_HANDLERS!;

const envAlias = process.env.SLS_STAGE === 'production' ? 'prod' : 'dev';
const eventBus = `gp2-events-${stage}`;
const eventBusSource = 'gp2.contentful';

const service = 'gp2-hub';
const appHostname = stage === 'production' ? hostname : `${stage}.${hostname}`;
const apiHostname =
  stage === 'production' ? `api.${hostname}` : `api-${stage}.${hostname}`;
const appUrl = `https://${appHostname}`;
const apiUrl = `https://${apiHostname}`;
const ciCommitSha = process.env.CI_COMMIT_SHA;
const currentRevision = process.env.CURRENT_REVISION!;
const nodeEnv = 'production';
const sesRegion = process.env.SES_REGION!;
const envRef = ['production', 'dev'].includes(stage) ? envAlias : `CI-${stage}`;

const algoliaIndex = process.env.ALGOLIA_INDEX ?? `gp2-hub_${envRef}`;
const s3SyncEnabled = process.env.S3_SYNC_ENABLED !== 'false';

export const plugins = [
  './serverless-plugins/serverless-esbuild',
  ...(s3SyncEnabled ? ['./serverless-plugins/serverless-s3-sync'] : []),
];

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
        allowedMethods: ['options', 'post', 'get', 'put', 'delete', 'patch'],
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
    environment: {
      NODE_ENV: nodeEnv,
      LOG_LEVEL: stage === 'production' ? 'error' : 'info',
      ACTIVE_CAMPAIGN_ACCOUNT: activeCampaignAccount,
      ACTIVE_CAMPAIGN_TOKEN: activeCampaignToken,
      APP_ORIGIN: appUrl,
      ENVIRONMENT: '${env:SLS_STAGE}',
      ALGOLIA_APP_ID: `\${ssm:gp2-algolia-app-id-${envAlias}}`,
      CURRENT_REVISION: ciCommitSha ?? currentRevision,
      CONTENTFUL_ENV_ID: contentfulEnvironment,
      CONTENTFUL_ACCESS_TOKEN: contentfulAccessToken,
      CONTENTFUL_MANAGEMENT_ACCESS_TOKEN: contentfulManagementAccessToken,
      CONTENTFUL_SPACE_ID: contentfulSpaceId,
    },
    iam: {
      role: {
        statements: [
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
                'ses:FromAddress': ['*@asap.science', '*@gp2.org'],
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
                  `event-bus/${eventBus}`,
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
    esbuild: {
      packager: 'yarn',
      platform: 'node',
      target: 'node20',
      bundle: true,
    },
    s3Sync: [
      {
        bucketName: '${self:service}-${self:provider.stage}-gp2-frontend',
        deleteRemoved: false,
        localDir: '../gp2-frontend/dist',
      },
      {
        bucketName: '${self:service}-${self:provider.stage}-gp2-auth-frontend',
        bucketPrefix: '.auth',
        localDir: '../gp2-auth-frontend/dist',
      },
      {
        bucketName: '${self:service}-${self:provider.stage}-messages-static',
        deleteRemoved: false,
        bucketPrefix: '.messages-static',
        localDir: '../gp2-messages/build-templates/static',
      },
    ],
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
      handler: 'src/handlers/api-handler.apiHandler',
      events: [
        {
          httpApi: {
            method: '*',
            path: '*',
          },
        },
      ],
      environment: {
        APP_ORIGIN: appUrl,
        AUTH0_AUDIENCE: auth0Audience,
        AUTH0_CLIENT_ID: auth0ClientId,
        CONTENTFUL_PREVIEW_ACCESS_TOKEN: contentfulPreviewAccessToken,
        SENTRY_DSN: sentryDsnApi,
        OPENAI_API_KEY: openaiApiKey,
      },
    },
    auth0FetchByCode: {
      handler: './src/handlers/webhooks/fetch-by-code.handler',
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
        ALGOLIA_API_KEY: `\${ssm:gp2-algolia-search-api-key-${envAlias}}`,
        SENTRY_DSN: sentryDsnHandlers,
      },
    },
    auth0ConnectByCode: {
      handler: './src/handlers/webhooks/connect-by-code.handler',
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
    subscribeCalendar: {
      handler: './src/handlers/calendar/subscribe-handler.handler',
      reservedConcurrency: 1,
      events: [
        {
          eventBridge: {
            eventBus,
            pattern: {
              source: [eventBusSource],
              'detail-type': [
                'CalendarsPublished',
              ] satisfies gp2.WebhookDetailType[],
            },
          },
        },
      ],
      environment: {
        GOOGLE_API_CREDENTIALS_SECRET_ID: `google-api-credentials-${envAlias}`,
        GOOGLE_API_TOKEN: `\${ssm:google-api-token-${envAlias}}`,
        SENTRY_DSN: sentryDsnHandlers,
        API_URL: apiUrl,
        REGION: '${env:AWS_REGION}',
      },
    },
    unsubscribeCalendars: {
      handler: './src/handlers/calendar/unsubscribe-handler.handler',
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
        API_URL: apiUrl,
        REGION: '${env:AWS_REGION}',
      },
    },
    inviteEventForwarder: {
      handler: 'src/handlers/user/forward-invite-handler.handler',
      events: [
        {
          eventBridge: {
            eventBus,
            pattern: {
              source: [eventBusSource],
              'detail-type': [
                'UsersPublished',
              ] satisfies gp2.WebhookDetailType[],
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
    inviteUser: {
      timeout: 120,
      reservedConcurrency: 1,
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
        EMAIL_SENDER: `\${ssm:email-invite-sender-gp2-${envAlias}}`,
        EMAIL_BCC: `\${ssm:email-invite-bcc-gp2-${envAlias}}`,
        EMAIL_RETURN: `\${ssm:email-invite-return-gp2-${envAlias}}`,
        SENTRY_DSN: sentryDsnHandlers,
      },
    },
    algoliaIndexOutput: {
      handler: './src/handlers/output/algolia-index-handler.handler',
      events: [
        {
          eventBridge: {
            eventBus,
            pattern: {
              source: [eventBusSource],
              'detail-type': [
                'OutputsPublished',
                'OutputsUnpublished',
              ] satisfies gp2.WebhookDetailType[],
            },
          },
        },
      ],
      environment: {
        ALGOLIA_API_KEY: `\${ssm:gp2-algolia-index-api-key-${envAlias}}`,
        ALGOLIA_INDEX: `${algoliaIndex}`,
        SENTRY_DSN: sentryDsnHandlers,
      },
    },
    algoliaIndexOutputUser: {
      handler: './src/handlers/output/algolia-index-user-handler.handler',
      events: [
        {
          eventBridge: {
            eventBus,
            pattern: {
              source: [eventBusSource],
              'detail-type': [
                'UsersPublished',
                'UsersUnpublished',
              ] satisfies gp2.WebhookDetailType[],
            },
          },
        },
      ],
      environment: {
        ALGOLIA_API_KEY: `\${ssm:gp2-algolia-index-api-key-${envAlias}}`,
        ALGOLIA_INDEX: `${algoliaIndex}`,
        SENTRY_DSN: sentryDsnHandlers,
      },
    },
    algoliaIndexOutputExternalUser: {
      handler:
        './src/handlers/output/algolia-index-external-user-handler.handler',
      events: [
        {
          eventBridge: {
            eventBus,
            pattern: {
              source: [eventBusSource],
              'detail-type': [
                'ExternalUsersPublished',
                'ExternalUsersUnpublished',
              ] satisfies gp2.WebhookDetailType[],
            },
          },
        },
      ],
      environment: {
        ALGOLIA_API_KEY: `\${ssm:gp2-algolia-index-api-key-${envAlias}}`,
        ALGOLIA_INDEX: `${algoliaIndex}`,
        SENTRY_DSN: sentryDsnHandlers,
      },
    },
    algoliaIndexOutputProject: {
      handler: './src/handlers/output/algolia-index-project-handler.handler',
      events: [
        {
          eventBridge: {
            eventBus,
            pattern: {
              source: [eventBusSource],
              'detail-type': [
                'ProjectsPublished',
                'ProjectsUnpublished',
              ] satisfies gp2.WebhookDetailType[],
            },
          },
        },
      ],
      environment: {
        ALGOLIA_API_KEY: `\${ssm:gp2-algolia-index-api-key-${envAlias}}`,
        ALGOLIA_INDEX: `${algoliaIndex}`,
        SENTRY_DSN: sentryDsnHandlers,
      },
    },
    algoliaIndexOutputWorkingGroup: {
      handler:
        './src/handlers/output/algolia-index-working-group-handler.handler',
      events: [
        {
          eventBridge: {
            eventBus,
            pattern: {
              source: [eventBusSource],
              'detail-type': [
                'WorkingGroupsPublished',
                'WorkingGroupsUnpublished',
              ] satisfies gp2.WebhookDetailType[],
            },
          },
        },
      ],
      environment: {
        ALGOLIA_API_KEY: `\${ssm:gp2-algolia-index-api-key-${envAlias}}`,
        ALGOLIA_INDEX: `${algoliaIndex}`,
        SENTRY_DSN: sentryDsnHandlers,
      },
    },
    algoliaIndexOutputEvent: {
      handler: './src/handlers/output/algolia-index-event-handler.handler',
      events: [
        {
          eventBridge: {
            eventBus,
            pattern: {
              source: [eventBusSource],
              'detail-type': [
                'EventsPublished',
                'EventsUnpublished',
              ] satisfies gp2.WebhookDetailType[],
            },
          },
        },
      ],
      environment: {
        ALGOLIA_API_KEY: `\${ssm:gp2-algolia-index-api-key-${envAlias}}`,
        ALGOLIA_INDEX: `${algoliaIndex}`,
        SENTRY_DSN: sentryDsnHandlers,
      },
    },
    algoliaIndexProject: {
      handler: './src/handlers/project/algolia-index-handler.handler',
      events: [
        {
          eventBridge: {
            eventBus,
            pattern: {
              source: [eventBusSource],
              'detail-type': [
                'ProjectsPublished',
                'ProjectsUnpublished',
              ] satisfies gp2.WebhookDetailType[],
            },
          },
        },
      ],
      environment: {
        ALGOLIA_API_KEY: `\${ssm:gp2-algolia-index-api-key-${envAlias}}`,
        ALGOLIA_INDEX: `${algoliaIndex}`,
        SENTRY_DSN: sentryDsnHandlers,
      },
    },
    algoliaIndexProjectUsers: {
      handler: './src/handlers/project/algolia-index-user-handler.handler',
      events: [
        {
          eventBridge: {
            eventBus,
            pattern: {
              source: [eventBusSource],
              'detail-type': [
                'UsersPublished',
                'UsersUnpublished',
              ] satisfies gp2.WebhookDetailType[],
            },
          },
        },
      ],
      environment: {
        ALGOLIA_API_KEY: `\${ssm:gp2-algolia-index-api-key-${envAlias}}`,
        ALGOLIA_INDEX: `${algoliaIndex}`,
        SENTRY_DSN: sentryDsnHandlers,
      },
    },
    algoliaIndexEvent: {
      handler: './src/handlers/event/algolia-index-handler.handler',
      events: [
        {
          eventBridge: {
            eventBus,
            pattern: {
              source: [eventBusSource],
              'detail-type': [
                'EventsPublished',
                'EventsUnpublished',
              ] satisfies gp2.WebhookDetailType[],
            },
          },
        },
      ],
      environment: {
        ALGOLIA_API_KEY: `\${ssm:gp2-algolia-index-api-key-${envAlias}}`,
        ALGOLIA_INDEX: `${algoliaIndex}`,
        SENTRY_DSN: sentryDsnHandlers,
      },
    },
    algoliaIndexEventCalendar: {
      handler: './src/handlers/event/algolia-index-calendar-handler.handler',
      events: [
        {
          eventBridge: {
            eventBus,
            pattern: {
              source: [eventBusSource],
              'detail-type': [
                'CalendarsPublished',
                'CalendarsUnpublished',
              ] satisfies gp2.WebhookDetailType[],
            },
          },
        },
      ],
      environment: {
        ALGOLIA_API_KEY: `\${ssm:gp2-algolia-index-api-key-${envAlias}}`,
        ALGOLIA_INDEX: `${algoliaIndex}`,
        SENTRY_DSN: sentryDsnHandlers,
      },
    },
    algoliaIndexEventUser: {
      handler: './src/handlers/event/algolia-index-user-handler.handler',
      events: [
        {
          eventBridge: {
            eventBus,
            pattern: {
              source: [eventBusSource],
              'detail-type': [
                'UsersPublished',
                'UsersUnpublished',
              ] satisfies gp2.WebhookDetailType[],
            },
          },
        },
      ],
      environment: {
        ALGOLIA_API_KEY: `\${ssm:gp2-algolia-index-api-key-${envAlias}}`,
        ALGOLIA_INDEX: `${algoliaIndex}`,
        SENTRY_DSN: sentryDsnHandlers,
      },
    },
    algoliaIndexEventsExternalUser: {
      handler:
        './src/handlers/event/algolia-index-external-user-handler.handler',
      events: [
        {
          eventBridge: {
            eventBus,
            pattern: {
              source: [eventBusSource],
              'detail-type': [
                'ExternalUsersPublished',
                'ExternalUsersUnpublished',
              ] satisfies gp2.WebhookDetailType[],
            },
          },
        },
      ],
      environment: {
        ALGOLIA_API_KEY: `\${ssm:gp2-algolia-index-api-key-${envAlias}}`,
        ALGOLIA_INDEX: `${algoliaIndex}`,
        SENTRY_DSN: sentryDsnHandlers,
      },
    },
    algoliaIndexUser: {
      handler: './src/handlers/user/algolia-index-handler.handler',
      events: [
        {
          eventBridge: {
            eventBus,
            pattern: {
              source: [eventBusSource],
              'detail-type': [
                'UsersPublished',
                'UsersUnpublished',
              ] satisfies gp2.WebhookDetailType[],
            },
          },
        },
      ],
      environment: {
        ALGOLIA_API_KEY: `\${ssm:gp2-algolia-index-api-key-${envAlias}}`,
        ALGOLIA_INDEX: `${algoliaIndex}`,
        SENTRY_DSN: sentryDsnHandlers,
      },
    },
    algoliaIndexUserProject: {
      handler: './src/handlers/user/algolia-index-project-handler.handler',
      events: [
        {
          eventBridge: {
            eventBus,
            pattern: {
              source: [eventBusSource],
              'detail-type': [
                'ProjectsPublished',
                'ProjectsUnpublished',
              ] satisfies gp2.WebhookDetailType[],
            },
          },
        },
      ],
      environment: {
        ALGOLIA_API_KEY: `\${ssm:gp2-algolia-index-api-key-${envAlias}}`,
        ALGOLIA_INDEX: `${algoliaIndex}`,
        SENTRY_DSN: sentryDsnHandlers,
      },
    },
    algoliaIndexUserWorkingGroup: {
      handler:
        './src/handlers/user/algolia-index-working-group-handler.handler',
      events: [
        {
          eventBridge: {
            eventBus,
            pattern: {
              source: [eventBusSource],
              'detail-type': [
                'WorkingGroupsPublished',
                'WorkingGroupsUnpublished',
              ] satisfies gp2.WebhookDetailType[],
            },
          },
        },
      ],
      environment: {
        ALGOLIA_API_KEY: `\${ssm:gp2-algolia-index-api-key-${envAlias}}`,
        ALGOLIA_INDEX: `${algoliaIndex}`,
        SENTRY_DSN: sentryDsnHandlers,
      },
    },
    algoliaIndexNews: {
      handler: './src/handlers/news/algolia-index-handler.handler',
      events: [
        {
          eventBridge: {
            eventBus,
            pattern: {
              source: [eventBusSource],
              'detail-type': [
                'NewsPublished',
                'NewsUnpublished',
              ] satisfies gp2.WebhookDetailType[],
            },
          },
        },
      ],
      environment: {
        ALGOLIA_API_KEY: `\${ssm:gp2-algolia-index-api-key-${envAlias}}`,
        ALGOLIA_INDEX: `${algoliaIndex}`,
        SENTRY_DSN: sentryDsnHandlers,
      },
    },
    algoliaIndexExternalUser: {
      handler: './src/handlers/external-user/algolia-index-handler.handler',
      events: [
        {
          eventBridge: {
            eventBus,
            pattern: {
              source: [eventBusSource],
              'detail-type': [
                'ExternalUsersPublished',
                'ExternalUsersUnpublished',
              ] satisfies gp2.WebhookDetailType[],
            },
          },
        },
      ],
      environment: {
        ALGOLIA_API_KEY: `\${ssm:gp2-algolia-index-api-key-${envAlias}}`,
        ALGOLIA_INDEX: `${algoliaIndex}`,
        SENTRY_DSN: sentryDsnHandlers,
      },
    },
    algoliaIndexWorkingGroup: {
      handler: './src/handlers/working-group/algolia-index-handler.handler',
      events: [
        {
          eventBridge: {
            eventBus,
            pattern: {
              source: [eventBusSource],
              'detail-type': [
                'WorkingGroupsPublished',
                'WorkingGroupsUnpublished',
              ] satisfies gp2.WebhookDetailType[],
            },
          },
        },
      ],
      environment: {
        ALGOLIA_API_KEY: `\${ssm:gp2-algolia-index-api-key-${envAlias}}`,
        ALGOLIA_INDEX: `${algoliaIndex}`,
        SENTRY_DSN: sentryDsnHandlers,
      },
    },
    updateEventsMeetingLink: {
      handler:
        './src/handlers/event/update-events-meeting-link-handler.handler',
      events: [
        {
          eventBridge: {
            eventBus,
            pattern: {
              source: [eventBusSource],
              'detail-type': [
                'EventsPublished',
              ] satisfies gp2.WebhookDetailType[],
            },
          },
        },
      ],
      environment: {
        ALGOLIA_API_KEY: `\${ssm:gp2-algolia-index-api-key-${envAlias}}`,
        ALGOLIA_INDEX: `${algoliaIndex}`,
        SENTRY_DSN: sentryDsnHandlers,
      },
    },
    contentfulWebhook: {
      handler: './src/handlers/webhooks/contentful.handler',
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
      handler: './src/handlers/webhooks/contentful-poller.handler',
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
        EVENT_BUS: eventBus,
        EVENT_SOURCE: eventBusSource,
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

    eventsUpdated: {
      handler: './src/handlers/webhooks/events-updated.handler',
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
    eventsUpdatedProcess: {
      timeout: 900,
      handler: './src/handlers/webhooks/events-updated-process.handler',
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
    syncActiveCampaignContact: {
      handler: './src/handlers/user/sync-active-campaign-contact.handler',
      events: [
        {
          eventBridge: {
            eventBus,
            pattern: {
              source: [eventBusSource],
              'detail-type': [
                'UsersPublished',
              ] satisfies gp2.WebhookDetailType[],
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
            eventBus,
            pattern: {
              source: [eventBusSource],
              'detail-type': [
                'UsersPublished',
              ] satisfies gp2.WebhookDetailType[],
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
          DomainName: apiHostname,
          DomainNameConfigurations: [
            {
              CertificateArn: gp2AwsAcmCertificateArn,
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
          DomainName: apiHostname,
          Stage: { Ref: 'HttpApiStage' },
        },
      },
      HttpApiRecordSetGroup: {
        Type: 'AWS::Route53::RecordSetGroup',
        Properties: {
          HostedZoneName: `${hostname}.`,
          RecordSets: [
            {
              Name: apiHostname,
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
              ThrottlingBurstLimit: 30,
              ThrottlingRateLimit: 100,
            },
          },
        },
      },
      FrontendBucket: {
        Type: 'AWS::S3::Bucket',
        DeletionPolicy: 'Delete',
        Properties: {
          BucketName: '${self:service}-${self:provider.stage}-gp2-frontend',
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
          BucketName:
            '${self:service}-${self:provider.stage}-gp2-auth-frontend',
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
          Bucket: '${self:service}-${self:provider.stage}-gp2-frontend',
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
          Bucket: '${self:service}-${self:provider.stage}-gp2-auth-frontend',
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
          'MessagesStaticBucket',
        ],
        Properties: {
          DistributionConfig: {
            Aliases: [appHostname],
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
              AcmCertificateArn: gp2AwsAcmCertificateArn,
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
              Name: appHostname,
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
      SubscribeCalendarDLQ: {
        Type: 'AWS::SQS::Queue',
        Properties: {
          MessageRetentionPeriod: 1_209_600, // 14 days
          QueueName:
            '${self:service}-${self:provider.stage}-subscribe-calendar-dlq',
        },
      },
      SubscribeCalendarDLQPolicy: {
        Type: 'AWS::SQS::QueuePolicy',
        Properties: {
          PolicyDocument: {
            Id: '${self:service}-${self:provider.stage}-subscribe-calendar-dlq-policy',
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
                  'Fn::GetAtt': [`SubscribeCalendarDLQ`, 'Arn'],
                },
              },
            ],
          },
          Queues: [
            {
              Ref: `SubscribeCalendarDLQ`,
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
          VisibilityTimeout: 900,
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
          VisibilityTimeout: 120, // Should match lambda timeout
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
      SubscribeCalendarLambdaFunction: {
        Properties: {
          DeadLetterConfig: {
            TargetArn: {
              'Fn::GetAtt': ['SubscribeCalendarDLQ', 'Arn'],
            },
          },
        },
      },
    },
  },
};

module.exports = serverlessConfig;
