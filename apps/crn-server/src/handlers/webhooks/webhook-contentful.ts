import 'source-map-support/register';
import { APIGatewayEvent, Handler } from 'aws-lambda';
import { framework as lambda } from '@asap-hub/services-common';
import { sentryWrapper } from '../../utils/sentry-wrapper';

export const handler: Handler<APIGatewayEvent> = sentryWrapper(
  lambda.http<Record<string, string>, void>(
    async (payload: lambda.Request<Record<string, string>>) => {
      /* eslint-disable no-console */
      console.log(JSON.stringify(payload, null, 2));
      return {
        statusCode: 200,
      };
    },
  ),
);
