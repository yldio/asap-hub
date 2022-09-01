import { framework as lambda } from '@asap-hub/services-common';
import { UserController } from '../../controllers';
import { Logger, validateAuth0Request } from '../../utils';
import { validateWebhookConnectByCodeBody } from '../../validation';

export const connectByCodeHandlerFactory =
  (
    users: UserController,
    auth0SharedSecret: string,
    logger: Logger,
  ): ((request: lambda.Request) => Promise<{ statusCode: number }>) =>
  async (request) => {
    validateAuth0Request(request, auth0SharedSecret);

    logger.debug(request.payload, 'Request payload');

    const { code, userId } = validateWebhookConnectByCodeBody(
      request.payload as Record<string, unknown>,
    );

    await users.connectByCode(code, userId);

    return {
      statusCode: 202,
    };
  };
