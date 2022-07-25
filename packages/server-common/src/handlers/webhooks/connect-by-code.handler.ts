import { framework as lambda } from '@asap-hub/services-common';
import { UserController } from '../../controllers';
import { validateAuth0Request } from '../../utils';
import { validateWebhookConnectByCodeBody } from '../../validation';

export const connectByCodeHandlerFactory =
  (
    users: UserController,
    auth0SharedSecret: string,
  ): ((request: lambda.Request) => Promise<{ statusCode: number }>) =>
  async (request) => {
    validateAuth0Request(request, auth0SharedSecret);

    const { code, userId } = validateWebhookConnectByCodeBody(
      request.payload as never,
    );

    await users.connectByCode(code, userId);

    return {
      statusCode: 202,
    };
  };
