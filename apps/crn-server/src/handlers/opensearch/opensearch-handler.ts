/* istanbul ignore file */
import { opensearchHandlerFactory } from '@asap-hub/server-common';
import { framework } from '@asap-hub/services-common';
import { Handler } from 'aws-lambda';
import logger from '../../utils/logger';
import { sentryWrapper } from '../../utils/sentry-wrapper';

const domainEndpoint = process.env.OPENSEARCH_DOMAIN_ENDPOINT || '';
const region = process.env.AWS_REGION || '';

export const opensearchHandler = framework.http(
  opensearchHandlerFactory(logger, domainEndpoint, region),
);

export const handler: Handler = sentryWrapper(opensearchHandler);
