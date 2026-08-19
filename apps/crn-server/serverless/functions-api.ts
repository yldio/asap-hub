import { AWS } from '@serverless/typescript';
import {
  appUrl,
  auth0Audience,
  auth0ClientId,
  auth0SharedSecret,
  contentfulWebhookAuthenticationToken,
  envAlias,
  openaiApiKey,
  opensearchMasterPassword,
  opensearchMasterUser,
  postmarkServerToken,
  sentryDsnApi,
  sentryDsnHandlers,
  sentryDsnPublicApi,
  slackWebhook,
  stage,
} from './shared';

const cookiePreferencesEnvironment = {
  COOKIE_PREFERENCES_TABLE_NAME:
    stage === 'local'
      ? 'asap-hub-dev-cookie-preferences'
      : '${self:service}-${self:provider.stage}-cookie-preferences',
  SENTRY_DSN: sentryDsnHandlers,
  ...(stage === 'local'
    ? {
        LOCAL_DYNAMODB_ENDPOINT:
          process.env.LOCAL_DYNAMODB_ENDPOINT || 'http://localhost:8000',
      }
    : {}),
};

export const apiFunctions: AWS['functions'] = {
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
    environment: cookiePreferencesEnvironment,
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
    environment: cookiePreferencesEnvironment,
  },
  getPresignedUrl: {
    handler: './src/handlers/files-upload/get-presigned-url-handler.handler',
    environment: {
      FILES_BUCKET: '${self:service}-${self:provider.stage}-files',
      DATA_BUCKET: {
        'Fn::If': [
          'IsProd',
          '${self:service}-${self:provider.stage}-data-backup',
          '${self:service}-dev-data-backup',
        ],
      },
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
  opensearchSearchHandler: {
    handler: './src/handlers/opensearch/opensearch-search-handler.handler',
    timeout: 30,
    memorySize: 512,
    name: 'asap-hub-${self:provider.stage}-opensearch-search-handler',
    environment: {
      SENTRY_DSN: sentryDsnHandlers,
      OPENSEARCH_USERNAME: opensearchMasterUser,
      OPENSEARCH_PASSWORD: opensearchMasterPassword,
    },
  },
};
