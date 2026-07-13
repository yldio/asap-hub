import { AWS } from '@serverless/typescript';
import assert from 'assert';

if (process.env.SLS_STAGE !== 'local') {
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
    'AWS_OS_USERNAME',
    'AWS_OS_PASSWORD',
  ].forEach((env) => {
    assert.ok(process.env[env], `${env} not defined`);
  });
}

export const stage = process.env.SLS_STAGE!;
assert.ok(
  stage === 'dev' ||
    stage === 'production' ||
    !isNaN(Number.parseInt(stage)) ||
    stage === 'local',
  'stage must be either "dev" or "production" or a PR number',
);

export const isProd = stage === 'production';
export const region = process.env.AWS_REGION as NonNullable<
  AWS['provider']['region']
>;
export const envAlias = isProd ? 'prod' : 'dev';
export const envRef =
  stage === 'production' ? 'prod' : stage === 'dev' ? 'dev' : `CI-${stage}`;

if (stage === 'dev' || stage === 'production') {
  ['SENTRY_DSN_API', 'SENTRY_DSN_PUBLIC_API', 'SENTRY_DSN_HANDLERS'].forEach(
    (env) => {
      assert.ok(process.env[env], `${env} not defined`);
    },
  );
}

export const activeCampaignAccount = process.env.ACTIVE_CAMPAIGN_ACCOUNT || '';
export const activeCampaignToken = process.env.ACTIVE_CAMPAIGN_TOKEN!;
export const sentryDsnApi = process.env.SENTRY_DSN_API!;
export const sentryDsnPublicApi = process.env.SENTRY_DSN_PUBLIC_API!;
export const sentryDsnHandlers = process.env.SENTRY_DSN_HANDLERS!;
export const auth0ClientId = process.env.AUTH0_CLIENT_ID!;
export const auth0Audience = process.env.AUTH0_AUDIENCE!;
export const auth0SharedSecret = process.env.AUTH0_SHARED_SECRET!;
export const contentfulEnvironment = process.env.CONTENTFUL_ENV!;
export const contentfulAccessToken = process.env.CONTENTFUL_ACCESS_TOKEN!;
export const contentfulPreviewAccessToken =
  process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN!;
export const contentfulManagementAccessToken =
  process.env.CONTENTFUL_MANAGEMENT_ACCESS_TOKEN!;
export const contentfulWebhookAuthenticationToken =
  process.env.CONTENTFUL_WEBHOOK_AUTHENTICATION_TOKEN!;
export const contentfulSpaceId = process.env.CONTENTFUL_SPACE_ID!;
export const sesRegion = process.env.SES_REGION!;
export const hostname = process.env.HOSTNAME!;
export const appHostname = isProd ? hostname : `${stage}.${hostname}`;
export const apiHostname = isProd
  ? `api.${hostname}`
  : `api-${stage}.${hostname}`;
export const appUrl = `https://${appHostname}`;
export const apiUrl = `https://${apiHostname}`;
export const nodeEnv = 'production';
export const ciCommitSha = process.env.CI_COMMIT_SHA;
export const currentRevision = process.env.CURRENT_REVISION!;
export const awsAcmCertificateArn = process.env.AWS_ACM_CERTIFICATE_ARN!;
export const slackWebhook = process.env.SLACK_WEBHOOK!;
export const logLevel = process.env.LOG_LEVEL!;
export const s3SyncEnabled = process.env.S3_SYNC_ENABLED !== 'false';
export const openaiApiKey = process.env.OPENAI_API_KEY!;
export const postmarkServerToken = process.env.POSTMARK_SERVER_TOKEN!;
export const opensearchMasterUser = process.env.AWS_OS_USERNAME!;
export const opensearchMasterPassword = process.env.AWS_OS_PASSWORD!;

export const algoliaIndex = process.env.ALGOLIA_INDEX
  ? process.env.ALGOLIA_INDEX
  : `asap-hub_${envRef}`;
export const service = 'asap-hub';

export const opensearchDomainName = isProd
  ? `${service}-${stage}-search`
  : `${service}-dev-search`;

export const opensearchDomain = isProd
  ? 'OpensearchDomainProd'
  : 'OpensearchDomain';

export const shouldCreateDomain = stage === 'production' || stage === 'dev';

export const offlineSSM =
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

export const eventBusSourceContentful = 'asap.contentful';

export const providerEnvironment = {
  ACTIVE_CAMPAIGN_ACCOUNT: activeCampaignAccount,
  ACTIVE_CAMPAIGN_TOKEN: activeCampaignToken,
  APP_ORIGIN: appUrl,
  DEBUG: isProd ? '' : 'crn-server,http',
  NODE_ENV: nodeEnv,
  ENVIRONMENT: stage,
  REGION: region,
  API_URL: apiUrl,
  LOG_LEVEL: logLevel || (isProd ? 'error' : 'info'),
  NODE_OPTIONS: '--enable-source-maps',
  ALGOLIA_APP_ID: `\${ssm:crn-algolia-app-id-${envAlias}}`,
  CURRENT_REVISION: ciCommitSha ?? currentRevision,
  CONTENTFUL_ENV_ID: contentfulEnvironment,
  CONTENTFUL_ACCESS_TOKEN: contentfulAccessToken,
  CONTENTFUL_PREVIEW_ACCESS_TOKEN: contentfulPreviewAccessToken,
  CONTENTFUL_MANAGEMENT_ACCESS_TOKEN: contentfulManagementAccessToken,
  CONTENTFUL_SPACE_ID: contentfulSpaceId,
  OPENSEARCH_DOMAIN_NAME: opensearchDomainName,
  ...(stage === 'local' && process.env.LOCAL_DYNAMODB_ENDPOINT
    ? { LOCAL_DYNAMODB_ENDPOINT: process.env.LOCAL_DYNAMODB_ENDPOINT }
    : {}),
};
